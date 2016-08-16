-- SQL Script file

CREATE DATABASE IF NOT EXISTS rsdb CHARACTER SET UTF8;

USE rsdb;

-- customer table
drop table if exists customer_tb;
create table customer_tb(
  cid int(8) auto_increment primary key,
  cname varchar(64),
  email varchar(64),
  telnum varchar(64),
  manager varchar(64)
);

alter table customer_tb AUTO_INCREMENT=101;

drop table if exists location_tb;
create table location_tb(
  lid int(8) auto_increment primary key,
  cid int(8),
  lname varchar(64),
  lcpos varchar(128), -- locatoin center's lat,lng
  sencount int(6), -- sensor count
  dataurl varchar(128), -- url can get sensor's data from it.
  dataurlb1 varchar(128), -- url bak1 can get sensor's data from it.
  dataurlb2 varchar(128), -- url bak2 can get sensor's data from it.
  locdefine varchar(2000), -- save location's in json str
  lastdatatime timestamp not null default current_timestamp
);
alter table location_tb AUTO_INCREMENT=1001;

drop table if exists position_tb;
create table position_tb(
  pid int(8) auto_increment primary key,
  lid int(8),
  gpspos varchar(128), -- position's lat,lng
  soid varchar(128), -- sensor's oid(the sensor put in this pos)
  installtime datetime,  -- sensor install time.
  lastdatatime datetime,   -- sensor install time.
  datacount int(2)   -- sensor data count
);
alter table position_tb AUTO_INCREMENT=10001;

drop table if exists sensordata_tb;
create table sensordata_tb (
  sdid int(10) auto_increment primary key,
  pid int(8),
  datatime timestamp not null default current_timestamp,
  sd1 float(6.2),
  sd2 float(6.2),
  sd3 float(6.2),
  sd4 float(6.2),
  sd5 float(6.2),
  sd6 float(6.2),
  sd7 float(6.2),
  sd8 float(6.2),
  sd9 float(6.2)
);

alter table sensordata_tb AUTO_INCREMENT=100001;


show tables;
desc customer_tb;
desc location_tb;
desc position_tb;
desc sensordata_tb;


