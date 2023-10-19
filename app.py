# Import Flask and render_template from Flask
from flask import Flask, render_template

# Create a Flask web application
app = Flask(__name__)


# Define route for the homepage


@app.route("/")
def index():
    return render_template("base.html")

# Define route for the dashboard


@app.route("/dashboard")
def dashboard():
    return render_template("base.html")

# Define route for the financials page


@app.route("/financials")
def financials():
    return render_template("financials.html")

# Define route for the finance watch page


@app.route("/financewatch")
def watch():
    return render_template("financewatch.html")

# Define route for the analytics page


@app.route("/analytics")
def analytics():
    return render_template("analytics.html")

# Define route for the contact page


@app.route("/contact")
def contact():
    return render_template("contact.html")


# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True)
