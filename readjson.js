const fs = require('fs')

fs.readFile( 'data.json', (err, data) => {
    if (err) throw err
    var obj = JSON.parse(data.toString())
    entries = Object.entries(obj)
    entries=setdatesintableformat(entries)
    entries=elim0null(entries)
    entries=elimresits(entries)
    entries=setexamdates(entries)
    printdata(entries)
    var fs = require('fs');
    var entries_object = {};
    for (i = 0; i < entries.length; i++) {
      entries_object[entries[i][0]] = entries[i][1];
    }
    fs.writeFile("altereddata.json", JSON.stringify(entries_object), function(err){
      if (err) {
        console.log(err)
      }
    })
})

function printdata(entries){
  for (i = 0; i < entries.length; i++) {
    for (j = 0; j < 2; j++) {
      console.log(entries[i][j])
    }
  }
}

function elim0null(entries){
  for (i=0;i<entries.length;i++){
    for (j = 0; j < entries[i][1].assessments.length; j++) {
      weight=entries[i][1].assessments[j].weight
      if ( weight==null || parseInt(weight)==0) {
        entries[i][1].assessments.splice(j, 1)
        j-=1
      }
    }
  }
  return entries
}

function elimresits(entries){
  for (i=0;i<entries.length;i++){
    weight=0
    for (j = 0; j < entries[i][1].assessments.length; j++) {
      weight+=parseInt(entries[i][1].assessments[j].weight)
      if (weight>100) {
        entries[i][1].assessments.splice(j, 1)
      }
    }
  }
  return entries
}

function setdatesintableformat(entries){
  for (i=0;i<entries.length;i++){
    for (j = 0; j < entries[i][1].assessments.length; j++) {
      if (entries[i][1].assessments[j].deadline!='Not Set') {
        date=convertdates(entries[i][1].assessments[j].deadline)
        entries[i][1].assessments[j].deadline=[date[0],date[3]]
      }
    }
  }
  return entries
}

function setexamdates(entries){
  for (i=0;i<entries.length;i++){
    exams=[]
    for (j = 0; j < entries[i][1].assessments.length; j++) {
      if (entries[i][1].assessments[j].deadline=='Not Set') {
        if (parseInt(entries[i][1].tb)==1){
          entries[i][1].assessments[j].deadline=[0,2]
        }
        if (parseInt(entries[i][1].tb)==2){
          entries[i][1].assessments[j].deadline=[0,20]
        }
        if (parseInt(entries[i][1].tb)==4){
          exams.push(j)
        }
      }
    }
    if (exams.length==1){
      entries[i][1].assessments[exams[0]].deadline=[0,20]
    }
    if (exams.length==2){
      entries[i][1].assessments[exams[0]].deadline=[0,2]
      entries[i][1].assessments[exams[1]].deadline=[0,20]
    }
  }
  return entries
}

function convertdates(date){
  date=date.split(" ");
  days=["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  months=["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  day=days.indexOf(date[0])
  dayofmonth=parseInt(date[1])
  month=months.indexOf(date[2])
  year=parseInt(date[3])
  week=getWeekNumber(year,month,dayofmonth)[1]
  return [day,dayofmonth,month,week,year]
}
//https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
function getWeekNumber(y,m,d) {
    // Copy date so don't modify original
    d = new Date(Date.UTC(y,m,d));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    // Get first day of year
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    // Return array of year and week number
    return [d.getUTCFullYear(), weekNo];
}
