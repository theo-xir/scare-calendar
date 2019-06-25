import mechanize, re, json, sys
from bs4 import BeautifulSoup
import http.cookiejar
from urllib.request import urlopen

def getsafeinfo(unit):
    link = "https://wwwa.fen.bris.ac.uk/" + unit + "/"
    cj = http.cookiejar.CookieJar()
    br = mechanize.Browser()
    br.set_cookiejar(cj)
    br.addheaders = [("Cookie","JSESSIONID=" + sys.argv[1])]
    br.open(link)
    plain = br.response().read()

    soup = BeautifulSoup(plain, "html.parser")
    tr = soup.findAll("tr")
    assessments = []
    for i in range(1,len(tr)):
        if(len(tr[i].contents) < 11): print("Unit " + unit + " can't be parsed !")
        else:
            assessments.append({"name" : tr[i].contents[3].findAll("a")[0].string,
                                "weight" : tr[i].contents[7].string,
                                "deadline" : tr[i].contents[11].string})
    # print(soup.find("b", text=re.compile(Credits)).next_sibling)
    data = {}
    data["credits"] = int(soup.find_all("b", string="Credits:")[0].next_sibling)
    data["assessments"] = assessments
    return data

def tbinfo(unit):
    link = "https://www.bris.ac.uk/unit-programme-catalogue/UnitDetails.jsa?unitCode=" + unit
    plain = urlopen(link)
    soup = BeautifulSoup(plain, "html.parser")
    tr = soup.findAll("tr")
    firstParagraph = str(soup.findAll("p")[1])
    if "Data for this unit not available" in firstParagraph: return -1
    if "Academic Year" in tr[4].td.contents[0]: return 4
    else: return tr[4].td.contents[0][tr[4].td.contents[0].index("Block")+6]

all = {}
coolOfCounter = 0
for unit in sys.argv[2:]:
    print("Processing " + unit)
    data = getsafeinfo(unit)
    data["tb"] = tbinfo(unit)
    all[unit] = data
    coolOfCounter += 1
f = open("data.json","w+")
f.write(json.dumps(all))
