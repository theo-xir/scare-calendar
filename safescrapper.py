import mechanize
from bs4 import BeautifulSoup
import http.cookiejar
import requests


cj = http.cookiejar.CookieJar()
br = mechanize.Browser()
br.set_cookiejar(cj)
br.open("https://wwwa.fen.bris.ac.uk/2018-9/coms/tx17079/progress.jsp")

br.select_form(nr=0)
br.form['username'] = 'tx17079'
br.form['password'] = 'wnrvAedjM8ni'
br.submit()

# print (br.response().read())

# w = Browser()
# w.go_to('https://sso.bris.ac.uk/sso/login')
# w.type('tx17079' , into='Username')
# w.type('wnrvAedjM8ni' , into='Password')
# w.click('Sign in')


plain = br.response().read()
f = open("a.txt","rw")
contents = f.read()
if (contents==plain):
    
f.write(plain)
f.close()
