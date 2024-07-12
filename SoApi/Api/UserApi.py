import json

from flask import Blueprint, request

from Config.ResultJson import ResultJson
from DbServer.UserServer import UserServer

user_api = Blueprint('user_api', __name__)


# 登录
@user_api.route('/user/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    if username and password:
        result = UserServer().login(username, password)
        if result:
            return ResultJson("登录成功", 200, "")
        else:
            return ResultJson("登录失败", -1, "")
    else:
        return ResultJson("用户名或密码为空", 1001, "")


# 注册
@user_api.route('/user/register', methods=['POST'])
def register():
    username = request.json.get('username')
    password = request.json.get('password')
    if username and password:
        find = UserServer().findUserByUserName(username)
        if find:
            return ResultJson("用户已存在。请登录", 200, "")
        else:
            reg = UserServer().register(username, password)
            if reg:
                return ResultJson("注册成功", 200, "")
            else:
                return ResultJson("注册失败", -1, "")
    else:
        return ResultJson("用户名或密码为空", 202, "")


# 查找全部用户
@user_api.route('/user/findAllUser', methods=['POST', 'GET'])
def findAllUser():
    data = UserServer().findAllUser()
    if data is None:
        return ResultJson("查找失败", 500, "")
    else:
        return ResultJson("查找成功", 200, data)


# 通过用户名进行查找用户
@user_api.route('/user/findUserByUserName', methods=['POST'])
def findUserByUserName():
    username = request.json.get('username')
    data = UserServer().findUserByUserName(username)
    if data is None:
        return ResultJson("查找失败", 500, "")
    else:
        return ResultJson("查找成功", 200, data)


# 更新用户信息
@user_api.route('/user/updateUser', methods=['POST'])
def updateUserPwd():
    username = request.json.get('username')
    password = request.json.get('password')
    role = request.json.get('role') if request.json.get('role') != "" else "用户"
    update = UserServer().UpdateUserPwd(username, password, role)
    if update:
        return ResultJson("更新成功", 200, "")
    else:
        return ResultJson("操作失败", -1, "")
