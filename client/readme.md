Client change log created by Mehran Arjmand
contact me : 
	mail: Sb.1993@yahoo.com
	telegram: @SilentB


#11/5/2014
====================================
	-profile fields completed
	-quick search completed
	-free times view generated(Still commented)
	-birthday_sms has been completed
	-server log now has view, with small features(it's retrieve logs from server every 3 second)
	-add some icons in buttons
	-send SMS feature
	requirement:
		sample input data and route for get/post data
		character per message
		each message cost
		details of "SMS panel" e.g. charge, panel number and so on
	usage:
		add this in menus in "page_data.js" for users which has permission to send SMS
		"{
                "title" : "ارسال پیامک گروهی",
                "icon" : "fa-mobile",
                "link" : "#/send-sms"
        }"


#29/4/2014
done
================================
	-fixed some bugs
	-added ngCloak in some views for hide objects when in loading
	-allow edit contacts in "contact-list" (it needs permission)
	-added custom toaster in dashboard
	usage:
	$scope.toaster.[type].([message]);
	types:
	error, info, success
	example:
	$scope.toaster.alert.("hello world");
	-added route under-construct for page that not ready in view
	-now you can add label object in menu items
	usage:
	in route "/page_data"
	in menu array you can add label object like this
	menus:[
		{
		//...something
		,label{
			text: [text(recommended to be a short text)]
			style: [label-danger, label-primary, label-warning, label-success]
		}
		}
	]
	-added FAQ page
	-"profile" page in now available for contacts to edit their informations
	-FeedBack page in now available
	-UI improvement
	-added dashboard UI
	-plug-ins is now bowered
	-added quote of day in dashboard screen
	-fixed bug in active menus
	-added bug report page


to-do
==================================
	-complete "user-report" view
	-complete fields in "profile"
	-complete advance search in "contact-list"
	-added quick search in "contact-list"
	-add free times in profile
	-send requests from MainController

elyas requests
==================================
	-/birthday_sms
	details:
	get: get current message and enable
	post: set message and enable and disable messaging

	-/root_sms
	details:
	properties:{
		مرد |زن |دانشجوی دانشگاه سحاد |نیروی فعال
	}
	/// gender types : {male, female, all}

