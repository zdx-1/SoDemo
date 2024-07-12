# 导入pymysql模块
import pymysql

# 建立数据库连接
conn = pymysql.connect(
    host='localhost',  # 主机名（或IP地址）
    port=3306,  # 端口号，默认为3306
    user='root',  # 用户名
    password='123456',  # 密码
    charset='utf8mb4'  # 设置字符编码
)

# 获取mysql服务信息（测试连接，会输出MySQL版本号）
print(conn.get_server_info())

# 创建游标对象
cursor = conn.cursor()

# 选择数据库
conn.select_db("SoDemo")

# 执行查询操作
cursor.execute('SELECT * FROM user')

# 获取查询结果，返回元组
result: tuple = cursor.fetchall()

print(result)

# 关闭游标和连接
cursor.close()
conn.close()
