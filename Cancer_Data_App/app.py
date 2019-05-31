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

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('JAWSDB_URL','') or "mysql+pymysql://root:Tomas1985t@localhost:3306/cancer"
# app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', '')

db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
both_cancer_rates = Base.classes.both_cancer_rates
cancer_by_gender = Base.classes.cancer_by_gender
total_cancer_deaths = Base.classes.cancer_deaths
cancer_deaths_gender = Base.classes.cancer_deaths_gender
cancer_rates = Base.classes.cancer_rates
cancer_rates_by_gender = Base.classes.cancer_rates_by_gender
cancer_vs_other_death_causes = Base.classes.cancer_vs_other_death_causes
demographics = Base.classes.demographics
hospital = Base.classes.hospital
# hospitalranking = Base.classes.hospitalranking
most_common_cancer_by_race = Base.classes.most_common_cancer_by_race
national_incidence_trends_gender = Base.classes.national_incidence_trends_gender
total_new_cancer = Base.classes.new_cancer
pctbyage = Base.classes.pctbyage
us_death_rate = Base.classes.us_death_rate


@app.route("/")
def cover():
    """Return the cover page."""
    return render_template("cover.html")

# @app.route("/index")
# def index():
#     """Return the homepage."""
#     return render_template("index.html")


    
@app.route("/hospitals")
def hospitals():
    """Hospital webpage"""
    return render_template("hospitals.html")

@app.route("/demographic")
def demographic():
    """Demographic webpage"""
    return render_template("demographic.html")

@app.route("/history")
def history():
    """History webpage"""

    return render_template("history.html")

@app.route("/data")
def data():
    """Data webpage"""
    return render_template("data.html")


@app.route("/sites")
def sites():
    """Return a list of sample names."""

    # Use Pandas to perform the sql query
    stmt = db.session.query(Both_cancer_rates).statement
    df = pd.read_sql_query(stmt, db.session.bind)
    return jsonify(list(df.loc[:,"site"]))

@app.route("/survival/<site>")
def survival(site):
    sel = [
        Both_cancer_rates.site,
        Both_cancer_rates.Survival_per_2009_2015,
    ]

    survival_results = db.session.query(*sel).filter(Both_cancer_rates.site == site).all()

    sample_survival = {}
    for result in survival_results:
        sample_survival["site"] = result[0]
        sample_survival["Survival_per_2009_2015"] = float(result[1])
    
    return jsonify(sample_survival)

@app.route("/both_cancer_rates/<site>")
def both_cancer_rate(site):
    """Return the MetaData for a given sample."""
    sel = [
        Both_cancer_rates.site,
        Both_cancer_rates.Estimated_NewCases_2019,
        Both_cancer_rates.Incidence_Rates2012_2016,
        Both_cancer_rates.Estimated_Deaths_2019,
        Both_cancer_rates.Mortality_Rates_2012_2016,
        Both_cancer_rates.Survival_per_2009_2015,
    ]

    results = db.session.query(*sel).filter(Both_cancer_rates.site == site).all()

    # Create a dictionary entry for each row of metadata information
    both_cancer_rates = {}
    for result in results:
        both_cancer_rates["site"] = result[0]
        both_cancer_rates["Estimate_NewCases_2019"] = result[1]
        both_cancer_rates["Incidence_Rates2012_2016"] = float(result[2])
        both_cancer_rates["Estimated_Deaths_2019"] = result[3]
        both_cancer_rates["Mortality_Rates_2012_2016"] = float(result[4])
        both_cancer_rates["Survival_per_2009_2015"] = float(result[5])

    print(both_cancer_rates)
    return jsonify(both_cancer_rates)

# Karuna
@app.route("/index")
def index():
    return render_template("index.html")
@app.route("/new_cancer")
def new_cancer():
    sel =[
        "cancer_number",
        "percentage_of_cancer",
        "cancer_type"
    ]
    results = db.session.query(*sel,total_new_cancer).all()
     # Create a dictionary entry for each row of information
    new_cancer_list = []
    for result in results:
        new_cancer_dict={}
        new_cancer_dict["number"] = float(result[0])
        new_cancer_dict["percent"] = float(result[1])*100
        new_cancer_dict["cancer_type"] = result[2]
        new_cancer_list.append(new_cancer_dict)
    print(new_cancer)
    return jsonify(new_cancer_list)



@app.route("/cancer_deaths")
def cancer_deaths():
    sel =[
        "number_of_deaths",
        "percent",
        "cancer_type"
    ]
    results = db.session.query(*sel, total_cancer_deaths).all()
     # Create a dictionary entry for each row of information
    cancer_deaths_list = []
    for result in results:
        print(result)
        cancer_deaths_dict = {}
        cancer_deaths_dict["number"] = result[0]
        cancer_deaths_dict["percent"] = float(result[1])*100
        cancer_deaths_dict["cancer_type"] = result[2]
        cancer_deaths_list.append(cancer_deaths_dict)
    print("completed loop")
    return jsonify(cancer_deaths_list)

@app.route("/both_cancer_rates_all")
def both_cancer_rates_all():
    """Return the MetaData for a given sample."""
    sel = [
        "site",
        "Estimated_NewCases_2019",
      
        "Survival_per_2009_2015"
   
    ]

    results = db.session.query(*sel,both_cancer_rates).all()

    # Create a dictionary entry for each row of metadata information
    both_cancer_rates_list = []
    for result in results:
        
        both_cancer_rates_dict = {}
        both_cancer_rates_dict["Site"] = result[0]
        both_cancer_rates_dict["Estimated_NewCases_2019"] = float(result[1])
        both_cancer_rates_dict["Survival_per_2009_2015"] = float(result[2])
        both_cancer_rates_list.append(both_cancer_rates_dict)
    
    return jsonify(both_cancer_rates_list)

if __name__ == "__main__":
    app.run(debug=True)