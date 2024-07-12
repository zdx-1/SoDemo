import json

import pymysql
from pymysql import cursors

from Config.BaseConfig import *


class UserServer:
    # 初始化连接，新建游标
    def __init__(self):
        self.conn = pymysql.connect(
            host=MYSQL_HOST,  # 主机名（或IP地址）
            port=MYSQL_PORT,  # 端口号，默认为3306
            user=MYSQL_USER,  # 用户名
            password=MYSQL_PASSWORD,  # 密码
            charset=MYSQL_CHARSET,  # 设置字符编码
            autocommit=MYSQL_AUTOCOMMIT,  # 自动提交更改
            database=MYSQL_DB,  # 数据库名称
            cursorclass=cursors.DictCursor  # 转换成字典格式输出
        )
        self.cursor = self.conn.cursor()

    # 关闭连接
    def __del__(self):
        self.cursor.close()
        self.conn.close()

    def login(self, username, password):
        sql = 'select * from user where username=%s and password=%s'
        self.cursor.execute(sql, (username, password))
        data = self.cursor.fetchall()
        if len(data) == 0:
            return False
        else:
            return True

    def register(self, username, password):
        sql = 'insert into user (username, password,role) values (%s, %s,"用户")'
        n = self.cursor.execute(sql, (username, password))
        if n == 0:
            return False
        else:
            return True

    def findAllUser(self):
        sql = 'select * from user'
        self.cursor.execute(sql)
        data = self.cursor.fetchall()
        if len(data) == 0:
            return ""
        else:
            return data

    def findUserByUserName(self, username):
        sql = 'select * from user where username=%s'
        self.cursor.execute(sql, username)
        data = self.cursor.fetchall()
        if len(data) == 0:
            return ""
        else:
            return data

    def UpdateUserPwd(self, username, password, role):
        sql = 'update user set password=%s,role=%s where username=%s'
        n = self.cursor.execute(sql, (password, role, username))
        if n == 0:
            return False
        else:
            return True
