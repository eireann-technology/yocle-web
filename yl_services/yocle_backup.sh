#!/bin/bash
#/gdrive/backup/yocle/mongodb

export TZ=Hongkong

while [ true ]
do
	echo `date +"%Y-%m-%d %H:%M:%S"`
	
	rm -r /gdrive/backup/yocle/yolofolio
	/usr/bin/mongodump -h localhost:2700 -d yolofolio -o /gdrive/backup/yocle/
	
	echo zipping...yocle_`date +"%Y%m%d"`.zip
	zip -r /gdrive/backup/yocle/yocle_`date +"%Y%m%d"`.zip /gdrive/backup/yocle/yolofolio/*
	
	echo uploading...yocle_`date +"%Y%m%d"`.zip
	ftp-upload -h alanpoon.ddns.net -u aland --password manipeer0723 -d /GoogleDrive/backup/yocle /gdrive/backup/yocle/yocle_`date +"%Y%m%d"`.zip
	echo uploading...done

	echo synchronizing...media
	#ftp-upload -h alanpoon.ddns.net -u aland --password manipeer0723 -d /GoogleDrive/backup/yocle/media /gdrive/_WEB/yocle/media/*
	#rsync /gdrive/_WEB/yocle/media/ alan@alanpoon.ddns.net:/
	#rsync -avz -P --password-file=/gdrive/backup/yocle/pwd.txt /gdrive/_WEB/yocle/media/ alanpoon.ddns.net:/gdrive/backup/yocle/media
	#rsync -avz --rsh="/usr/bin/sshpass -p manipeer0723 ssh -o StrictHostKeyChecking=no -l root" /gdrive/_WEB/yocle/media/ alanpoon.ddns.net:/gdrive/backup/yocle/media
	rsync -vz --exclude "/" --rsh="/usr/bin/sshpass -p manipeer0723 ssh -o StrictHostKeyChecking=no -l root" /gdrive/_WEB/yocle/media/ alanpoon.ddns.net:/gdrive/_WEB/yocle/media
	echo synchronizing...done

	echo completed

	echo waiting for...1h
	sleep 1h
done
