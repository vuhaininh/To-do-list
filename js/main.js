/***** Refactor *****/
var todoListModule = (function () {
		var appKeys = {
			totalWork:"total",
			workList:"workList",
			todoItem:"item"
		}
		function setTotalWork(total){
			localStorage.setItem(appKeys.totalWork,total);
		}
		function getTotalWork(){
			total = localStorage.getItem(appKeys.totalWork);
			if (total == null)
				return total;
			else
				return parseInt(total);
		}
		function getWorkList(){
			wl = localStorage.getItem(appKeys.workList);
			return wl;	
		}
		function setWorkList(worklist){
			localStorage.setItem(appKeys.workList,worklist);
		}
		function todo(id,description,date)
		{
			this.id=id;
			this.description=description;
			this.date=date;
		}

		function addNew(tableId,descriptionId, dateId){
			id = getTotalWork()+1;
			description = $('#'+descriptionId).val();
			date = $('#'+dateId).val() 
			localStorage.setItem(appKeys.todoItem+id, $.toJSON(new todo(id,description,date)));
			setTotalWork(getTotalWork()+1);
			$("#"+tableId+" > tbody").append("<tr><td>"+($.evalJSON(getWorkList()).length+1)+"</td>"+
												"<td>"+description+"</td>"+
												"<td>"+date+"</td>"+
												"<td><button type='button' class='btn btn-primary' onclick = 'todoListModule.deleteWork(this)' value='"+id+"'>Delete</button></td>"+
												"<td><button type='button' class='btn btn-primary' onclick = 'todoListModule.editWork(this)' value='"+id+"'>Edit</button></td></tr>");
			var worklist;
			if (getWorkList() == null)
				worklist = new Array();
			else
				worklist = $.evalJSON(getWorkList());
			worklist.push(id);
			setWorkList($.toJSON(worklist));
		
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
					$(this).html("<button type='button' class='btn btn-primary' onclick = 'todoListModule.finishEditingWork(this)' value='"+button.value+"'>Done</button>");
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
					$(this).html("<button type='button' class='btn btn-primary' onclick = 'todoListModule.editWork(this)' value='"+button.value+"'>Edit</button>");
			});
			item = $.evalJSON(localStorage.getItem(appKeys.todoItem+button.value));
			item.description = editDes;
			item.date = editDate;
			localStorage.setItem(appKeys.todoItem+button.value, $.toJSON(item));
		}
		function deleteItem(button){
			worklist = $.evalJSON(getWorkList());
			index = worklist.indexOf(parseInt(button.value));
			worklist.splice(index,1);
			localStorage.removeItem(appKeys.todoItem+button.value);
			setWorkList($.toJSON(worklist));
			var tr = $(button).closest('tr');
			tr.fadeOut(400, function(){
					tr.remove();
				});
		}
		function displayTable(tableId){
			var worklist = getWorkList();
			if(worklist != null){
				worklist = $.evalJSON(getWorkList());
				for(i = 0; i < worklist.length; i++){
					id = worklist[i];
					item = $.evalJSON(localStorage.getItem(appKeys.todoItem+id));
					$("#"+tableId+" > tbody").append("<tr><td>"+(i+1)+"</td><td>"+item.description+"</td><td>"+item.date+"</td><td><button type='button' class='btn btn-primary' onclick = 'todoListModule.deleteWork(this)' value='"+id+"'>Delete</button></td><td><button type='button' class='btn btn-primary' onclick = 'todoListModule.editWork(this)' value='"+id+"'>Edit</button></td></tr>");
				}
			}
		}
		function supports_html5_storage() {
			if(typeof(Storage)!=="undefined")
				return true
			else
				return false
		}
		function setDatePicker(id){
			var today = new Date();
			$('#'+id).datepicker('setValue', today)
		}
	   function init(){
			setDatePicker('dpd1');
			if(supports_html5_storage()){
				if(getTotalWork() == null){
					setTotalWork(0);
					setWorkList($.toJSON(new Array()));
				}
				displayTable('worklist');
			}
			else
				alert ("Do not support this browser!");
	   }
       return {
            newWork: addNew,
            editWork: editItem,
			finishEditingWork: finishEditing,
            deleteWork: deleteItem,
			init:init
        };
 
    })();
/***** ===END=== *****/

$( document ).ready(function() {
	todoListModule.init();
});


