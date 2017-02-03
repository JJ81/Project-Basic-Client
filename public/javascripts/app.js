/**
 * Created by yijaejun on 01/12/2016.
 */
'use strict';
require.config({
	map: {},
	paths: {
		jquery: ['/components/gentelella/vendors/jquery/dist/jquery.min'],
		bootstrap: ['/components/gentelella/vendors/bootstrap/dist/js/bootstrap.min'],
		custom: ['/components/gentelella/build/js/custom.min'],
		iCheck: ['/components/gentelella/vendors/iCheck/icheck.min'],
		npPogress: ['/components/gentelella/vendors/nprogress/nprogress'],
		bootstrapProgressbar: ['/components/gentelella/vendors/bootstrap-progressbar/bootstrap-progressbar.min'],
		fastclick: ['/components/gentelella/vendors/fastclick/lib/fastclick'],
		common: ['/javascripts/common']
	},
	shim: {
		custom: ['jquery'],
		bootstrap: ['jquery'],
		bootstrapProgressbar: ['jquery'],
		iCheck:['jquery'],
	}
});
