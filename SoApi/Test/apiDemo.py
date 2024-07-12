#!/usr/bin/python3
# encoding:utf-8
import flask, json

# 实例化api，把当前这个python文件当作一个服务，__name__代表当前这个python文件
api = flask.Flask(__name__)


# 'index'是接口路径，methods不写，默认get请求
@api.route('/index', methods=['get'])
# get方式访问
def index():
    ren = {'msg': '成功访问首页', 'msg_code': 200}
    # json.dumps 序列化时对中文默认使用的ascii编码.想输出中文需要指定ensure_ascii=False
    return json.dumps(ren, ensure_ascii=False)


# post入参访问方式一：url格式参数
@api.route('/article', methods=['post'])
def article():
    # url格式参数?id=12589&name='lishi'
    id = flask.request.args.get('id')

    if id:
        if id == '12589':
            ren = {'msg': '成功访问文章', 'msg_code': 200}
        else:
            ren = {'msg': '找不到文章', 'msg_code': 400}
    else:
        ren = {'msg': '请输入文章id参数', 'msg_code': -1}
    return json.dumps(ren, ensure_ascii=False)


# post入参访问方式二：from-data（k-v）格式参数
@api.route('/login', methods=['post'])
def login():
    # from-data格式参数
    usrname = flask.request.values.get('usrname')
    pwd = flask.request.values.get('pwd')

    if usrname and pwd:
        if usrname == 'test' and pwd == '123456':
            ren = {'msg': '登录成功', 'msg_code': 200}
        else:
            ren = {'msg': '用户名或密码错误', 'msg_code': -1}
    else:
        ren = {'msg': '用户名或密码为空', 'msg_code': 1001}
    return json.dumps(ren, ensure_ascii=False)


# post入参访问方式二：json格式参数
@api.route('/loginjosn', methods=['post'])
def loginjosn():
    # from-data格式参数
    usrname = flask.request.json.get('usrname')
    pwd = flask.request.json.get('pwd')

    if usrname and pwd:
        if usrname == 'test' and pwd == '123456':
            ren = {'msg': '登录成功', 'msg_code': 200}
        else:
            ren = {'msg': '用户名或密码错误', 'msg_code': -1}
    else:
        ren = {'msg': '用户名或密码为空', 'msg_code': 1001}
    return json.dumps(ren, ensure_ascii=False)


if __name__ == '__main__':
    api.run(port=8888, debug=True, host='127.0.0.1')  # 启动服务
    # debug=True,改了代码后，不用重启，它会自动重启
    # 'host='127.0.0.1'别IP访问地址
