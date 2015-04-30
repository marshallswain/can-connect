var QUnit = require("steal-qunit");
var localStorage = require("../localstorage-cache");
var connect = require("can-connect");

var logErrorAndStart = function(e){
	debugger;
	ok(false,"Error "+e);
	start();
};

var items = [{id: 1, foo:"bar"},{id: 2, foo:"bar"},{id: 3, foo:"bar"}];
var aItems = [{id: 10, name: "A"},{id: 11, name: "A"},{id: 12, name: "A"}];

QUnit.module("can-connect/localstorage-cache",{
	setup: function(){
		this.connection = connect([localStorage],{
			name: "todos"
		});
		this.connection.reset();
	}
});

QUnit.test("updateListData", function(){
	var items = [{id: 1, foo:"bar"},{id: 2, foo:"bar"},{id: 3, foo:"bar"}];
	
	var connection = this.connection;
	
	stop();
	connection.getListData({foo: "bar"})
		.then(function(){
			ok(false, "should have rejected, nothing there");
			start();
		}, function(){
			
			connection.updateListData({foo: "bar"}, { data: items.slice(0) })
				.then(function(){
					
					connection.getListData({foo: "bar"}).then(function(listData){
						
						deepEqual(listData.data, items);
						
						start();
						
					},logErrorAndStart);
					
				}, logErrorAndStart);
			
		});
	
});



QUnit.test("updateInstanceData", function(){

	var connection = this.connection;
	
	stop();

			
	var a1 = connection.updateListData({foo: "bar"}, { data: items.slice(0) });
		
	var a2 = connection.updateListData({name: "A"}, { data: aItems.slice(0) });
		
	can.when(a1, a2).then(updateItem,logErrorAndStart );
	function updateItem(){
		connection.updateInstanceData({id: 4, foo:"bar"}).then(checkItems, logErrorAndStart);
	}
	function checkItems() {
		connection.getListData({foo: "bar"}).then(function(listData){
						
			deepEqual(listData.data, items.concat({id: 4, foo:"bar"}), "updateInstanceData added item 4");
			
			updateItem2();
			
		},logErrorAndStart);
	}
	function updateItem2(){
		connection.updateInstanceData({id: 4, name:"A"}).then(checkItems2, logErrorAndStart);
	}
	function checkItems2() {
		connection.getListData({foo: "bar"}).then(function(listData){
						
			deepEqual(listData.data, items,"item 4 no longer in foo");
			
			checkItems3();
			
		},logErrorAndStart);
	}
	function checkItems3() {
		connection.getListData({name: "A"}).then(function(listData){
						
			deepEqual(listData.data, aItems.concat([{id: 4, name:"A"}]));
			
			start();
			
		},logErrorAndStart);
	}
});

QUnit.test("createInstanceData", function(){

	var connection = this.connection;
	
	stop();

			
	var a1 = connection.updateListData({foo: "bar"}, { data: items.slice(0) });
		
	var a2 = connection.updateListData({name: "A"}, { data: aItems.slice(0) });
		
	can.when(a1, a2).then(createItem,logErrorAndStart );
	function createItem(){
		connection.createInstanceData({id: 4, foo:"bar"}).then(checkItems, logErrorAndStart);
	}
	function checkItems() {
		connection.getListData({foo: "bar"}).then(function(listData){
						
			deepEqual(listData.data, items.concat({id: 4, foo:"bar"}), "updateInstanceData added item 4");
			
			createItem2();
			
		},logErrorAndStart);
	}
	function createItem2(){
		connection.updateInstanceData({id: 5, name:"A"}).then(checkItems2, logErrorAndStart);
	}
	function checkItems2() {
		connection.getListData({foo: "bar"}).then(function(listData){
						
			deepEqual(listData.data, items.concat({id: 4, foo:"bar"}),"item 4 sill in foo");
			
			checkItems3();
			
		},logErrorAndStart);
	}
	function checkItems3() {
		connection.getListData({name: "A"}).then(function(listData){
						
			deepEqual(listData.data, aItems.concat([{id: 5, name:"A"}]));
			
			start();
			
		},logErrorAndStart);
	}
});

QUnit.test("destroyInstanceData", function(){

	var connection = this.connection;
	
	stop();

			
	var a1 = connection.updateListData({foo: "bar"}, { data: items.slice(0) });
		
	var a2 = connection.updateListData({name: "A"}, { data: aItems.slice(0) });
		
	can.when(a1, a2).then(destroyItem,logErrorAndStart );
	function destroyItem(){
		connection.destroyInstanceData({id: 1, foo:"bar"}).then(checkItems, logErrorAndStart);
	}
	function checkItems() {
		connection.getListData({foo: "bar"}).then(function(listData){
						
			deepEqual(listData.data, items.slice(1), "updateInstanceData removed 1st item");
			
			destroyItem2();
			
		},logErrorAndStart);
	}
	function destroyItem2(){
		connection.destroyInstanceData({id: 10, name: "A"}).then(checkItems2, logErrorAndStart);
	}
	function checkItems2() {
		connection.getListData({foo: "bar"}).then(function(listData){
						
			deepEqual(listData.data, items.slice(1),"item 4 sill in foo");
			
			checkItems3();
			
		},logErrorAndStart);
	}
	function checkItems3() {
		connection.getListData({name: "A"}).then(function(listData){
						
			deepEqual(listData.data, aItems.slice(1) );
			
			start();
			
		},logErrorAndStart);
	}
});