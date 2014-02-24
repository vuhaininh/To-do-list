var totalWork = "total";
var workList = "workList";
var todoItem = "item";
$( document ).ready(function() {
	setDatePicker();
	if(supports_html5_storage()){
		if(getTotalWork() == null){
			setTotalWork(0);
			setWorkList($.toJSON(new Array()));
		}
		displayTable();
	}
});

function addNew(){
	id = getTotalWork()+1;
	description = $('#dsc1').val();
	date = $('#dpd1').val() 
	var todo = {
		"id": id ,
		"description": description,
		"date": date
	}
	localStorage.setItem(todoItem+id, $.toJSON(todo));
	setTotalWork(getTotalWork()+1);
	addNewRowToTable(id,description,date);
	
	var worklist;
	if (getWorkList() == null)
		worklist = new Array();
	else
		worklist = $.evalJSON(getWorkList());
	worklist.push(id);
	setWorkList($.toJSON(worklist));
}
function setTotalWork(total){
	localStorage.setItem(totalWork,total);
}
function getTotalWork(){
	total = localStorage.getItem(totalWork);
	if (total == null)
		return total;
	else
		return parseInt(total);
}
function getWorkList(){
	wl = localStorage.getItem(workList);
	return wl;	
}
function setWorkList(worklist){
	localStorage.setItem(workList,worklist);
}
function supports_html5_storage() {
	if(typeof(Storage)!=="undefined")
		return true
	else
		return false
}
function setDatePicker(){
	var today = new Date();
	$('#dpd1').datepicker('setValue', today)
}
function editItem(button){
	var tr = $(button).closest('tr');
    $('td',tr).each(function() {
		 if($(this).index() == 1)
			$(this).html('<input type="text" value="' + $(this).html() + '" />');
		 if($(this).index() == 2){
			$(this).html('<input type="text" id = "edit_'+button.value+'" value="' + $(this).html() + '" />');
			$('#edit_'+button.value).datepicker();
		 }
		if($(this).index() == 4)
			$(this).html("<button type='button' class='btn btn-primary' onclick = 'finishEditing(this)' value='"+button.value+"'>Done</button>");
    });
}
function finishEditing(button){
	var tr = $(button).closest('tr');
	var editDes;
	var editDate;
    $('td',tr).each(function() {
		 if($(this).index() == 1){
			editDes = $(this).find("input").val();
			$(this).html(editDes);
		 }
		 if($(this).index() == 2){
			editDate = $(this).find("input").val();
			$(this).html(editDate);
		 }
		if($(this).index() == 4)
			$(this).html("<button type='button' class='btn btn-primary' onclick = 'editItem(this)' value='"+button.value+"'>Edit</button>");
    });
	item = $.evalJSON(localStorage.getItem(todoItem+button.value));
	item.description = editDes;
	item.date = editDate;
	localStorage.setItem(todoItem+button.value, $.toJSON(item));
}
function deleteItem(button){
	worklist = $.evalJSON(getWorkList());
	index = worklist.indexOf(parseInt(button.value));
	worklist.splice(index,1);
	localStorage.removeItem(todoItem+button.value);
	setWorkList($.toJSON(worklist));
	var tr = $(button).closest('tr');
    tr.fadeOut(400, function(){
            tr.remove();
        });
}
function displayTable(){
	var worklist = getWorkList();
	if(worklist != null){
		worklist = $.evalJSON(getWorkList());
		for(i = 0; i < worklist.length; i++){
			id = worklist[i];
			item = $.evalJSON(localStorage.getItem(todoItem+id));
			$("#worklist > tbody").append("<tr><td>"+(i+1)+"</td><td>"+item.description+"</td><td>"+item.date+"</td><td><button type='button' class='btn btn-primary' onclick = 'deleteItem(this)' value='"+id+"'>Delete</button></td><td><button type='button' class='btn btn-primary' onclick = 'editItem(this)' value='"+id+"'>Edit</button></td></tr>");
		}
	}
}
function addNewRowToTable(id,description,date){
	$("#worklist > tbody").append("<tr><td>"+($.evalJSON(getWorkList()).length+1)+"</td><td>"+description+"</td><td>"+date+"</td><td><button type='button' class='btn btn-primary' onclick = 'deleteItem(this)' value='"+id+"'>Delete</button></td><td><button type='button' class='btn btn-primary' onclick = 'editItem(this)' value='"+id+"'>Edit</button></td></tr>");
}