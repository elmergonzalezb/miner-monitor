/**
 * @namespace configCtrl
 *
 * @author: Felix Brucker
 * @version: v0.0.1
 *
 * @description
 * handles functionality for the config page
 *
 */
(function () {
  'use strict';

  angular
    .module('app')
    .controller('configCtrl', configController);

  function configController($scope, $interval, $http, $filter) {

    var vm = this;
    vm.config = {
      types: [],
      devices: [],
      groups:[],
      interval: null
    };
    vm.waiting = null;
    vm.updating = null;

    vm.newDevice = {
      id: null,
      enabled: true,
      name: "",
      type: "",
      hostname: "",
      group:""
    };

    vm.newGroup = {
      id: null,
      enabled: true,
      name: ""
    };



    // controller API
    vm.init = init;
    vm.getConfig = getConfig;
    vm.setConfig = setConfig;
    vm.update = update;
    vm.addDevice = addDevice;
    vm.delDevice = delDevice;
    vm.addGroup=addGroup;
    vm.delGroup=delGroup;


    /**
     * @name init
     * @desc data initialization function
     * @memberOf configCtrl
     */
    function init() {
      angular.element(document).ready(function () {
        vm.getConfig();
      });
    }


    /**
     * @name addDevice
     * @desc add new device to array
     * @memberOf configCtrl
     */
    function addDevice() {
      if (vm.newDevice.name !== "" && vm.newDevice.hostname !== "" && vm.newDevice.type !== "") {
        //gen unique id
        vm.newDevice.id = Date.now();
        //replace / if exists at the end of the hostname
        vm.newDevice.hostname = vm.newDevice.hostname.replace(/\/$/, "");
        //add to array
        vm.config.devices.push(JSON.parse(JSON.stringify(vm.newDevice)));
        //clear variables
        vm.newDevice = {
          id: null,
          enabled: true,
          name: "",
          type: "",
          hostname: "",
          group:""
        };
        vm.setConfig();
      } else {
        return false;
      }
    }

    /**
     * @name delDevice
     * @desc delete device from array
     * @memberOf configCtrl
     */
    function delDevice(id) {
      vm.config.devices.forEach(function (entry, index, array) {
        if (entry.id === id) {
          vm.config.devices.splice(index, 1);
        }
      });
      vm.setConfig();
    }

    /**
     * @name addGroup
     * @desc add new group to array
     * @memberOf configCtrl
     */
    function addGroup() {
      if (vm.newGroup.name!==""&&vm.newGroup.name!==null){
        //gen unique id
        vm.newGroup.id=Date.now();
        //add to array
        vm.config.groups.push(JSON.parse(JSON.stringify(vm.newGroup)));
        //clear variables
        vm.newGroup={
          id:null,
          enabled:true,
          name:""
        };
        vm.setConfig();
      }
    }


    /**
     * @name delGroup
     * @desc delete group from array
     * @memberOf configCtrl
     */
    function delGroup(id) {
      vm.config.groups.forEach(function (entry,index,array) {
        if (entry.id===id){
          vm.config.groups.splice(index,1);
        }
      });
      vm.setConfig();
    }


    /**
     * @name getConfig
     * @desc get the config
     * @memberOf configCtrl
     */
    function getConfig() {
      return $http({
        method: 'GET',
        url: 'api/config'
      }).then(function successCallback(response) {
        vm.config.types = response.data.types;
        vm.config.devices = response.data.devices;
        vm.config.groups = response.data.groups;
        vm.config.interval = response.data.interval;
        vm.config.devices = $filter('orderBy')(vm.config.devices, 'name');
        vm.config.groups = $filter('orderBy')(vm.config.groups, 'name');
      }, function errorCallback(response) {
        console.log(response);
      });
    }


    /**
     * @name setConfig
     * @desc set the config
     * @memberOf configCtrl
     */
    function setConfig() {
      vm.waiting = true;
      return $http({
        method: 'POST',
        url: 'api/config',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        data: vm.config
      }).then(function successCallback(response) {
        setTimeout(function () {
          vm.waiting = false;
        }, 500);
      }, function errorCallback(response) {
        console.log(response);
      });
    }



    /**
     * @name update
     * @desc updates the project from git
     * @memberOf configCtrl
     */
    function update() {
      vm.updating = true;
      return $http({
        method: 'POST',
        url: 'api/config/update',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then(function successCallback(response) {
        setTimeout(function () {
          vm.updating = false;
        }, 500);
      }, function errorCallback(response) {
        console.log(response);
      });
    }


    // call init function on firstload
    vm.init();

  }

})();