from flask import Flask, request
from screen import display

app = Flask(__name__)

@app.route('/webhook', methods=['POST'])
def webhook():
    if request.method == 'POST':
        print("Data received from Webhook is: ", request.json)
        display()
        return "Webhook received!"

app.run(host='0.0.0.0', port=8000)
