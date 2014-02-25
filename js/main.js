/***** Refactor *****/
var todoListModule = (function () {
		 var myList;
         /*** MODEL ***/
		/********* Todo item constructor************/
		var Todo = function(id,description,date){
			this.id=id;
			this.description=description;
			this.date=date;
		};
		
		/********* TodoList constructor************/
		var TodoList = function(totalWork,workList,todoItem){
			this.totalWork = totalWork;
			this.workList = workList;
			this.todoItem = todoItem;
		};
		/********* TodoList Method************/
		TodoList.prototype.setTotalWork = function(total){
			localStorage.setItem(this.totalWork,total);
		};
		TodoList.prototype.getTotalWork = function(){
			total = localStorage.getItem(this.totalWork);
			if (total == null)
				return total;
			else
				return parseInt(total);
		};
		/********* Get Todo List************/
		TodoList.prototype.getWorkList = function(){
			wl = localStorage.getItem(this.workList);
			return wl;	
		};
		/********* Set Todo List************/
		TodoList.prototype.setWorkList = function(worklist){
			localStorage.setItem(this.workList,worklist);	
		};
		/********* Add 1 more item into Todo List************/
		TodoList.prototype.addWorkList = function(id){
			var worklist;
			if (this.getWorkList() == null)
				worklist = new Array();
			else
				worklist = $.evalJSON(this.getWorkList());
			worklist.push(id);
			this.setWorkList($.toJSON(worklist));
		};
		/********* Remove 1 item from Todo List************/
		TodoList.prototype.removeWorkList = function(id){
			worklist = $.evalJSON(this.getWorkList());
			index = worklist.indexOf(parseInt(id));
			worklist.splice(index,1);
			localStorage.removeItem(this.todoItem+id);
			this.setWorkList($.toJSON(worklist));
		};
		/********* Add new Todo************/
		TodoList.prototype.addNewWork = function(description, date){
			id = this.getTotalWork()+1;
			localStorage.setItem(this.todoItem+id, $.toJSON(new Todo(id,description,date)));
			this.setTotalWork(this.getTotalWork()+1);
			this.addWorkList(id);
		};	
		/********* Delete Todo************/
		TodoList.prototype.deleteWork = function(id){
			this.removeWorkList(id);
		};	
		/********* Edit Todo************/
		TodoList.prototype.updateWork = function(todo){
			localStorage.setItem(this.todoItem+todo.id, $.toJSON(todo));
		};	
		
		/*** ===END MODEL=== ***/
	
		function addNew(tableId,descriptionId, dateId){
			description = $('#'+descriptionId).val();
			date = $('#'+dateId).val();
			myList.addNewWork(description, date);
			$("#"+tableId+" > tbody").append("<tr><td>"+($.evalJSON(myList.getWorkList()).length)+"</td>"+
												"<td>"+description+"</td>"+
												"<td>"+date+"</td>"+
												"<td><button type='button' class='btn btn-primary' onclick = 'todoListModule.deleteWork(this)' value='"+id+"'>Delete</button></td>"+
												"<td><button type='button' class='btn btn-primary' onclick = 'todoListModule.editWork(this)' value='"+id+"'>Edit</button></td></tr>");
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
			item = $.evalJSON(localStorage.getItem(myList.todoItem+button.value));
			item.description = editDes;
			item.date = editDate;
			myList.updateWork(item);
		}
		function deleteItem(button){
			myList.deleteWork(button.value);
			var tr = $(button).closest('tr');
			tr.fadeOut(400, function(){
					tr.remove();
				});
		}
		function displayTable(tableId){
			var worklist = myList.getWorkList();
			if(worklist != null){
				worklist = $.evalJSON(myList.getWorkList());
				for(i = 0; i < worklist.length; i++){
					id = worklist[i];
					item = $.evalJSON(localStorage.getItem(myList.todoItem+id));
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
	   function init(total,worklist,item,dp,tableId){
			myList = new TodoList(total,worklist,item)
			setDatePicker(dp);
			if(supports_html5_storage()){
				if(myList.getTotalWork() == null){
					myList.setTotalWork(0);
					myList.setWorkList($.toJSON(new Array()));
				}
				displayTable(tableId);
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
	todoListModule.init("total2","workList2","item2","dpd1","worklist");
});


