import json


def ResultJson(msg, code, data):
    dic = {
        "msg": "" if msg == "" else msg,
        "code": "0" if code == 0 else code,
        "data": "" if data == "" else data,
    }
    return json.dumps(dic, ensure_ascii=False)
