from openpyxl import load_workbook
from app.home.models import BoundaryTable, BoundaryPopulation
from sqlalchemy import func
from app import db
import sys
import logging

reload(sys)
sys.setdefaultencoding('utf-8')


def encodeToUTF(value):
    # return value.encode('utf-8').replace("*", "")
    return value.replace("*", "")


def get_boundary_id_by_row(boundaryname, parentid=None):
    if parentid is not None:
        boundary = BoundaryTable.query.filter(
            (func.lower(BoundaryTable.name).like("%{0}%".format(boundaryname.lower()))) & (BoundaryTable.parentid==parentid)).first()
    else:
        boundary = BoundaryTable.query.filter(func.lower(BoundaryTable.name).like("%{0}%".format(boundaryname.lower()))).first()
    if boundary is not None:
        return boundary

    return None


def find_population_boundary(boundaryid):
    return BoundaryPopulation.query.filter(BoundaryPopulation.boundaryid==boundaryid).first()


def load_population_from_excel(infile, region_name):
    try:
        wb = load_workbook(infile, read_only=True, use_iterators=True)
        ws = wb.active
        rows = ws.rows

        populations = []

        # Skip 9 row for column label
        for i in range(1, 7):
            rows.next()

        # get the id of the region
        population_num = next(rows)[2].value
        region = BoundaryTable.query.filter(func.lower(BoundaryTable.name).like("%{0}%".format(region_name.lower()))).first()

        if find_population_boundary(region.id) is None:
            populations.append(BoundaryPopulation(boundaryid=region.id, population=population_num))

        print "Region: {0}-{1} Population: {2}".format(region.name, region.id, population_num)

        rows.next()

        next_prov = next(rows)[1].value
        # print "next prov: {0}".format(next_prov)

        found_province = get_boundary_id_by_row(next_prov, region.id)

        province = found_province if found_province is not None else None
        city = None
        # print "Province {0} id: {1}".format(province.name, province.id)

        for item in rows:
            border = item[1].border if item[1].parent is not None else None
            if border is not None and border.bottom.style is not None:
                rows.next()
                next_item = next(rows, None)
                if next_item is not None and next_item[1] is not None and next_item[1].value is not None:
                    found_province = get_boundary_id_by_row(next_item[1].value.replace("*", "").replace("CITY", "").replace(" ", "").replace("(Capital)", ""), region.id)
                    if found_province is not None:
                        # print "found province: {0}".format(next_item[1].value)
                        province = found_province
                        if item[2].value is not None and find_population_boundary(province.id) is None:
                            populations.append(BoundaryPopulation(boundaryid=province.id, population=item[2].value))
                        print "Province: {0}-{1} Population: {2}".format(province.name, province.id, item[2].value)
            elif item[1].value is None:
                # print "condition 2: {0} - {1}".format(item[0].value, item[1].value)
                continue
            elif item[1].value is not None and item[2].value is not None and not str(item[2].value).isdigit():
                # print "condition 3: {0} - {1}".format(item[1].value, item[2].value)
                continue
            else:
                # get the boldness if is bold and has content and population number
                if item[1].value is not None and item[2].value is not None and str(item[2].value).isdigit():
                    if item[1].style.font.bold and item[2].style.font.bold:
                        city_name = encodeToUTF(item[1].value).replace('CITY OF ', '').replace('Capital', '')
                        # print "City: {0} Population: {1}".format(city_name, item[2].value)
                        if province is not None:
                            found_city = get_boundary_id_by_row(city_name, province.id)
                            if found_city is not None:
                                city = found_city
                                if item[2].value is not None and find_population_boundary(city.id) is None:
                                    populations.append(BoundaryPopulation(boundaryid=city.id, population=item[2].value))
                                print "Province: {0} City: {1}-{2} Population: {3}".format(province.name, city.name, city.id, item[2].value)
                    else:
                        # this is brgy
                        brgy_name = encodeToUTF(item[1].value)
                        if city is not None:
                            found_brgy = get_boundary_id_by_row(brgy_name, city.id)
                            if found_brgy is not None and find_population_boundary(found_brgy.id) is None:
                                print "BRGY: {0}-{1} Population: {2}".format(encodeToUTF(found_brgy.name), found_brgy.id, item[2].value)
                                # insert to boundary population table
                                populations.append(BoundaryPopulation(boundaryid=found_brgy.id, population=item[2].value))

        if len(populations) > 0:
            db.session.add_all(populations)
            db.session.commit()

    except IOError as e:
        print 'Error While Reading Excel File: {0}'.format(e.strerror)
        return None

