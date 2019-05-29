import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

import pymysql
pymysql.install_as_MySQLdb()

app = Flask(__name__)

#################################################
# Database Setup
#################################################

app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://root:Tomas1985t@localhost:3306/cancer"
# app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', '')

db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
both_cancer_rates = Base.classes.both_cancer_rates
cancer_by_gender = Base.classes.cancer_by_gender
cancer_deaths = Base.classes.cancer_deaths
cancer_deaths_gender = Base.classes.cancer_deaths_gender
cancer_rates = Base.classes.cancer_rates
cancer_rates_by_gender = Base.classes.cancer_rates_by_gender
cancer_vs_other_death_causes = Base.classes.cancer_vs_other_death_causes
demographics = Base.classes.demographics
hospital = Base.classes.hospital
hospitalrank_ing = Base.classes.hospitalrank_ing
most_common_cancer_by_race = Base.classes.most_common_cancer_by_race
national_incidence_trends_gender = Base.classes.national_incidence_trends_gender
new_cancer = Base.classes.new_cancer
pctbyage = Base.classes.pctbyage
us_death_rate = Base.classes.us_death_rate


@app.route("/")
def cover():
    """Return the cover page."""
    return render_template("cover.html")

@app.route("/index.html")
def index():
    """Return the homepage."""
    return render_template("index.html")

@app.route("/hospitals.html")
def hospitals():
    """Hospital webpage"""
    return render_template("hospitals.html")

@app.route("/demographic.html")
def demographic():
    """Demographic webpage"""
    return render_template("demographic.html")

@app.route("/data.html")
def data():
    """Data webpage"""
    return render_template("data.html")


@app.route("/both_cancer_rates/<site>")
def both_cancer_rates(site):
    #removed site 
    """Return the MetaData for a given sample."""
    sel = [
        both_cancer_rates.Site,
        both_cancer_rates.Estimate_NewCases_2019,
        both_cancer_rates.Incidence_Rates2012_2016,
        both_cancer_rates.Estimated_Deaths_2019,
        both_cancer_rates.Mortality_Rates_2012_2016,
        both_cancer_rates.Survival_per_2009_2015,
    ]

    results = db.session.query(*sel).filter(both_cancer_rates.Site == Site).all()

    # Create a dictionary entry for each row of metadata information
    both_cancer_rates = {}
    for result in results:
        both_cancer_rates["Site"] = result[1]
        both_cancer_rates["Estimate_NewCases_2019"] = result[2]
        both_cancer_rates["Incidence_Rates2012_2016"] = result[3]
        both_cancer_rates["Estimated_Deaths_2019"] = result[4]
        both_cancer_rates["Mortality_Rates_2012_2016"] = result[5]
        both_cancer_rates["Survival_per_2009_2015"] = result[6]

    print(both_cancer_rates)
    return jsonify(both_cancer_rates)

if __name__ == "__main__":
    app.run(debug=True)