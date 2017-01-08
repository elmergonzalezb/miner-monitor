'use strict';

const https = require('https');
const http = require('http');
var fs = require('fs');
var path = require('path');
var colors = require('colors/safe');


var configModule = require(__basedir + 'api/modules/configModule');

var stats = {
  entries:{}
};

var interval=null;

function getStats(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(stats));
}


function getMinerStats(device) {
  var arr = device.hostname.split("://");
  var protocol=arr[0];
  arr = arr[1].split(":");
  var path="";
  switch(device.type){
    case "baikal-miner":
      path="/f_status.php?all=1";
      break;
    case "miner-agent":
      path="/api/mining/stats";
      break;
  }
  switch(protocol){
    case "http":
      var req= http.request({
        host: arr[0],
        path: path,
        method: 'GET',
        port: arr[1],
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }, function (response) {
        response.setEncoding('utf8');
        var body = '';
        response.on('data', function (d) {
          body += d;
        });
        response.on('end', function () {
          //console.log(body);
          var parsed = null;
          try{
            parsed=JSON.parse(body);
          }catch(error){
            console.log(colors.red("["+device.name+"] Error: Unable to get stats data"));
          }
          if (parsed != null){
            switch(device.type){
              case "baikal-miner":
                if (parsed.status!==false){
                  parsed.status.type=device.type;
                  parsed.status.name=device.name;
                  if(stats.entries[device.group]!==undefined&&stats.entries[device.group]!==null)
                    stats.entries[device.group][device.id]=parsed.status;
                  else{
                    stats.entries[device.group]={};
                    stats.entries[device.group][device.id]=parsed.status;
                  }
                }
                break;
              case "miner-agent":
                parsed.type=device.type;
                parsed.name=device.name;
                if(stats.entries[device.group]!==undefined&&stats.entries[device.group]!==null)
                  stats.entries[device.group][device.id]=parsed;
                else{
                  stats.entries[device.group]={};
                  stats.entries[device.group][device.id]=parsed;
                }
                break;
            }
          }else{
            switch(device.type){
              case "baikal-miner":
                if(stats.entries[device.group]!==undefined&&stats.entries[device.group]!==null)
                  stats.entries[device.group][device.id]={type:device.type,name:device.name,devs:{}};
                else{
                  stats.entries[device.group]={};
                  stats.entries[device.group][device.id]={type:device.type,name:device.name,devs:{}};
                }
                break;
              case "miner-agent":
                if(stats.entries[device.group]!==undefined&&stats.entries[device.group]!==null)
                  stats.entries[device.group][device.id]={type:device.type,name:device.name,entries:{}};
                else{
                  stats.entries[device.group]={};
                  stats.entries[device.group][device.id]={type:device.type,name:device.name,entries:{}};
                }
                break;
            }
          }
        });
      }).on("error", function(error) {
        switch(device.type){
          case "baikal-miner":
            if(stats.entries[device.group]!==undefined&&stats.entries[device.group]!==null)
              stats.entries[device.group][device.id]={type:device.type,name:device.name,devs:{}};
            else{
              stats.entries[device.group]={};
              stats.entries[device.group][device.id]={type:device.type,name:device.name,devs:{}};
            }
            break;
          case "miner-agent":
            if(stats.entries[device.group]!==undefined&&stats.entries[device.group]!==null)
              stats.entries[device.group][device.id]={type:device.type,name:device.name,entries:{}};
            else{
              stats.entries[device.group]={};
              stats.entries[device.group][device.id]={type:device.type,name:device.name,entries:{}};
            }
            break;
        }
        console.log(colors.red("["+device.name+"] Error: Unable to get stats data"));
        console.log(error);
      });
      req.end();
      break;
    case "https":
      var req= https.request({
        host: arr[0],
        path: path,
        method: 'GET',
        port: arr[1],
        rejectUnauthorized: false,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }, function (response) {
        response.setEncoding('utf8');
        var body = '';
        response.on('data', function (d) {
          body += d;
        });
        response.on('end', function () {
          //console.log(body);
          var parsed = null;
          try{
            parsed=JSON.parse(body);
          }catch(error){
            console.log(colors.red("["+device.name+"] Error: Unable to get stats data"));
          }
          if (parsed != null){
            switch(device.type){
              case "baikal-miner":
                if (parsed.status!==false){
                  parsed.status.type=device.type;
                  parsed.status.name=device.name;
                  if(stats.entries[device.group]!==undefined&&stats.entries[device.group]!==null)
                    stats.entries[device.group][device.id]=parsed.status;
                  else{
                    stats.entries[device.group]={};
                    stats.entries[device.group][device.id]=parsed.status;
                  }
                }
                break;
              case "miner-agent":
                parsed.type=device.type;
                parsed.name=device.name;
                if(stats.entries[device.group]!==undefined&&stats.entries[device.group]!==null)
                  stats.entries[device.group][device.id]=parsed;
                else{
                  stats.entries[device.group]={};
                  stats.entries[device.group][device.id]=parsed;
                }
                break;
            }
          }else{
            switch(device.type){
              case "baikal-miner":
                if(stats.entries[device.group]!==undefined&&stats.entries[device.group]!==null)
                  stats.entries[device.group][device.id]={type:device.type,name:device.name,devs:{}};
                else{
                  stats.entries[device.group]={};
                  stats.entries[device.group][device.id]={type:device.type,name:device.name,devs:{}};
                }
                break;
              case "miner-agent":
                if(stats.entries[device.group]!==undefined&&stats.entries[device.group]!==null)
                  stats.entries[device.group][device.id]={type:device.type,name:device.name,entries:{}};
                else{
                  stats.entries[device.group]={};
                  stats.entries[device.group][device.id]={type:device.type,name:device.name,entries:{}};
                }
                break;
            }
          }
        });
      }).on("error", function(error) {
        switch(device.type){
          case "baikal-miner":
            if(stats.entries[device.group]!==undefined&&stats.entries[device.group]!==null)
              stats.entries[device.group][device.id]={type:device.type,name:device.name,devs:{}};
            else{
              stats.entries[device.group]={};
              stats.entries[device.group][device.id]={type:device.type,name:device.name,devs:{}};
            }
            break;
          case "miner-agent":
            if(stats.entries[device.group]!==undefined&&stats.entries[device.group]!==null)
              stats.entries[device.group][device.id]={type:device.type,name:device.name,entries:{}};
            else{
              stats.entries[device.group]={};
              stats.entries[device.group][device.id]={type:device.type,name:device.name,entries:{}};
            }
            break;
        }
        console.log(colors.red("["+device.name+"] Error: Unable to get stats data"));
        console.log(error);
      });
      req.end();
      break;
  }
}

function getAllMinerStats(){
  for(var i=0;i<configModule.config.groups.length;i++){
    var group=configModule.config.groups[i];
    if(group.enabled){
      for(var j=0;j<configModule.config.devices.length;j++){
        var device=configModule.config.devices[j];
        if(device.enabled&&device.group===group.name)
          getMinerStats(JSON.parse(JSON.stringify(device)));
      }
    }
  }
}

function cleanup(){
  Object.keys(stats.entries).forEach(function(key) {
    stats.entries[key]=null;
  });
}

function restartInterval(){
  clearInterval(interval);
  interval=setInterval(getAllMinerStats,configModule.config.interval*1000);
}

function init() {
  getAllMinerStats();
  interval=setInterval(getAllMinerStats,configModule.config.interval*1000);
}

setTimeout(init, 2000);

exports.getStats = getStats;
exports.restartInterval = restartInterval;
exports.cleanup = cleanup;