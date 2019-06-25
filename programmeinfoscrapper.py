import mechanize, re, json, sys
from bs4 import BeautifulSoup
import http.cookiejar
from urllib.request import urlopen

year='2'
code='4COSC008U'
link = "https://www.bris.ac.uk/unit-programme-catalogue/RouteStructure.jsa?byCohort=N&cohort=Y&routeLevelCode=" + year + "&ayrCode=18%2F19&modeOfStudyCode=Full+Time&programmeCode=" + code
cj = http.cookiejar.CookieJar()
br = mechanize.Browser()
br.set_cookiejar(cj)
br.set_handle_robots(False)
br.open(link)
plain = br.response().read()

soup = BeautifulSoup(plain, "html.parser")
tr = soup.findAll("tr")
todel=[]
for i in range(0,len(tr)):
    print(i)
    if(len(tr[i].contents) < 10):
        todel.append(i)
print(todel)
print(len(tr))
for i in range(len(todel)):
    x=todel[i]
    print(x)
    del tr[x]
print(tr)
