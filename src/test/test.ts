let test_1 = {
    "[]": {
        "User": {
            "sex": 0,
            "@order": "age+",
            "@column": "id,cname"
        }
    }
}
let test_2 = {
    "[]": {
        "User": {},
        "Message[]": {}
    }
}
let test_3 = {
    "[]": {
        "Message": {
            "id": "3"
        },
        "User": {
            "id@": "/Message/userId"
        }

    }
}