from flask import Flask, render_template, request 


app = Flask("palma-store")

@app.route("/")
def hello_world():
    return "<p>Hello World </p>"



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)