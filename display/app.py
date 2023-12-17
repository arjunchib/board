from flask import Flask, request
from screen import display

app = Flask(__name__)

@app.route('/webhook', methods=['POST'])
def webhook():
    if request.method == 'POST':
        content = request.json
        print("Data received from Webhook is: ", content)
        display(content['image'])
        return "Webhook received!"
