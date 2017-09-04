from faker import Factory

fake = Factory.create('en_US')

test_password = 'ayalaland'

users = [
    {
        'username': 'admin',
        'roleid': 1
    },
    {
        'username': 'user1',
        'roleid': 2
    },
    {
        'username': 'user2',
        'roleid': 3
    },
    {
        'username': 'user3',
        'roleid': 4
    },
    {
        'username': 'user4',
        'roleid': 5
    },
    {
        'username': 'user5',
        'roleid': 6
    },
    {
        'username': 'user6',
        'roleid': 7
    }
]

for index, user in enumerate(users):
    user['firstname'] = fake.first_name().lower()
    user['lastname'] = fake.last_name().lower()
    user['password'] = test_password
    users[index] = user