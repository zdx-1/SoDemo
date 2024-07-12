from flask import Flask

from Api.UserApi import user_api
from Config.BaseConfig import *

app = Flask(__name__)

app.register_blueprint(user_api)


@app.route("/")
def hello():
    return "Hello World!"


if __name__ == "__main__":
    app.run(port=SERVER_PORT, debug=True, host=SERVER_HOST)
