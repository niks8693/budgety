
//Implementing the Module Pattern for this project
//Create separate modules for budget handling, UI updates and an app controller to interact with both modules
//The module pattern works because of IIFE and closures concept
//IIFE let us implement data privacy and data encapsulation where as closures help us to access our private vars
//and expose only pubic methods
//Closures means the inner function has the excess to the vars and parameters of its outer function
//even after the outer func has been returned

//BUDGET CONTROLLER
var budgetController=(
	function(){

		// Expense function constructor
		var Expense= function(id,description,value){
			this.id=id;
			this.description=description;
			this.value=value;
			this.percentage=-1;

		};

		Expense.prototype.calcPercentage=function(totalIncome){
			if(totalIncome>0){
				this.percentage=Math.round((this.value/totalIncome)*100);
			}
			else{
				this.percentage=-1;
			}
			
		};

		Expense.prototype.getPercentage=function(){
			return this.percentage;
		};
		// Income function constructor
		var Income= function(id,description,value){
			this.id=id;
			this.description=description;
			this.value=value;

		};

		//calculate the totals based on type

		var calculateTotal=function(type){
			var sum=0;
			data.allItems[type].forEach(function(current){
				sum=sum+current.value;
			});

			data.totals[type]=sum;


		};

		// data structure to receive data
		var data={
			allItems:{
				exp:[],
				inc:[]

			},
			totals:{
				exp:0,
				inc: 0
			},
			budget:0,
			percentage:-1


		}; // end of data ds

		return {
			addItem: function(type,des,val){
				var newItem,id;
				//id =last id +1
				//create new id
				if(data.allItems[type].length >0){
					id=data.allItems[type][data.allItems[type].length-1].id+1;
				}
				else{
					id=0;
				}
				
				//create new item based on inc or exp
				if(type==='exp'){
					newItem=new Expense(id,des,val);
				}
				else if(type==='inc'){
					newItem=new Income(id,des,val);
				}
				//push new item data in our data ds
				data.allItems[type].push(newItem);
				//return new item
				return newItem;

			},

			deleteItem:function(type,id){
				var ids,index;
				//map() is similar to forEach but it returns a new array
				//we are using map() coz we need to extract the diff ids from our ds to delete one item based on the id
				//to delete based on id we need to find out the index of the id in our array

				ids=data.allItems[type].map(function(current){
					return current.id;
				});
				//indexOf() returns the index of the element passed in the parameter
				//returns -1 of index not found
				index=ids.indexOf(id);

				if(index!==-1){
					//splice() takes the index from which we want to delete items from our array
					//and the no. of items we want to delete from that index
					data.allItems[type].splice(index,1);
				}

			},

			calculateBudget: function(){

				//1. calculate total income and expenses
				calculateTotal('inc');
				calculateTotal('exp');

				//2. calculate budget where budget=income-expenses
				data.budget=data.totals.inc-data.totals.exp;

				//3. calculate the percentage of income that we spent
				if(data.totals.inc>0){
					data.percentage= Math.round((data.totals.exp/data.totals.inc)*100);
				}
				else{
					data.percentage=-1;
				}
				


			},

			calculatePercentages:function(){

				data.allItems.exp.forEach(function(current){
					current.calcPercentage(data.totals.inc);
				});

			},

			getPercentages:function(){
				var allPerc=data.allItems.exp.map(function(current){
					return current.getPercentage();
				});
				return allPerc;
			},

			getBudget:function(){
				return {
					budget:data.budget,
					totalInc: data.totals.inc,
					totalExp: data.totals.exp,
					percentage: data.percentage

				};
			},

			showdata: function(){
				console.log(data);
			}

		};


	}

	)();

//UI CONTROLLER
var UIController=(
	function(){

		var DOMstrings={
			inputType:'.add__type',
			inputDescription:'.add__description',
			inputValue:'.add__value',
			inputBtn:'.add__btn',
			incomeContainer:'.income__list',
			expenseContainer:'.expenses__list',
			budgetLabel:'.budget__value',
			incomeLabel:'.budget__income--value',
			expenseLabel:'.budget__expenses--value',
			percentageLabel:'.budget__expenses--percentage',
			container:'.container',
			expensesPercLabel:'.item__percentage',
			dateLabel:'.budget__title--month'

		};
		var formatNumber=function(num,type){
				/*
				+ or - before the number depending up on the type
				excatly two decimals
				comma separating the thousands
				ex: 2310.4567==> + 2,310.46
				2000==> + 2,000.00

				*/

				var numSplit,int, dec, type;
				num=Math.abs(num);
				num=num.toFixed(2);// makes a number format to only 2 decimals
				numSplit=num.split('.');
				int=numSplit[0];
				dec=numSplit[1];
				if(int.length>3){
					int=int.substr(0,int.length-3)+','+int.substr(int.length-3,3); //input 23150==>o/p==>23,150
				}
				var type=type==='exp'?sign='-':sign='+';
				return type+' '+int+'.'+dec;

			};


		return{

			getInput:function(){

				//returning an object with 3 properties of the input fields 
				return {
				type:document.querySelector(DOMstrings.inputType).value,// will be either inc or exp
				description:document.querySelector(DOMstrings.inputDescription).value,
				//parseFloat converts string into number
				 value:parseFloat(document.querySelector(DOMstrings.inputValue).value)

				};
				
			},// end of getInput()

			addListItem:function(obj, type){
				var html,newHtml,element;
				//1. create html string with placeholder text
				if(type==='inc'){
					element=DOMstrings.incomeContainer;
					html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div>'
			+'<div class="right clearfix"><div class="item__value">%value%</div>'+
			'<div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>'
			+'</div></div></div>';
				}
				else if(type==='exp'){
					element=DOMstrings.expenseContainer;
					html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div>'+
                           '<div class="right clearfix"><div class="item__value">%value%</div>'+
                           '<div class="item__percentage">21%</div><div class="item__delete">'+
                           '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>'+
                           '</div></div></div>' ;         
                        
				}
	


				//2. replace placeholder text with actual data
				newHtml=html.replace('%id%',obj.id);
				newHtml=newHtml.replace('%description%',obj.description);
				newHtml=newHtml.replace('%value%',formatNumber(obj.value,type));


				//3. insert the html into dom
				document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);

			},

			deleteListItem: function(selectorID){
				var el=document.getElementById(selectorID);
				el.parentNode.removeChild(el);

			},

			clearFields: function(){
				var fields, fieldsArr;
				// list of all the input elements
				fields=document.querySelectorAll(DOMstrings.inputDescription+', '+DOMstrings.inputValue);
				//converting list into an array using the slice method of Array in the prototype property of Arrays
				fieldsArr=Array.prototype.slice.call(fields);
				//using a foreach loop to clear fields
				fieldsArr.forEach(function(current,index,array){
					current.value="";

				});
				//focus back on the first element of the array, hereits the description field
				fieldsArr[0].focus();

			},

			displayBudget: function(obj){
				var type
				obj.budget>0? type='inc':type='exp';
				document.querySelector(DOMstrings.budgetLabel).textContent=formatNumber(obj.budget,type);
				document.querySelector(DOMstrings.incomeLabel).textContent=formatNumber(obj.totalInc,'inc');
				document.querySelector(DOMstrings.expenseLabel).textContent=formatNumber(obj.totalExp,'exp');
				if(obj.percentage>0){
					document.querySelector(DOMstrings.percentageLabel).textContent=obj.percentage+'%';
				}
				else{
					document.querySelector(DOMstrings.percentageLabel).textContent='----';
				}
				

			},


			displayPercentages:function(percentages){
				var fields=document.querySelectorAll(DOMstrings.expensesPercLabel);
				var nodeListForEach=function(list,callback){

					for(var i=0;i<list.length;i++){
						callback(list[i],i);
					}

				};

				nodeListForEach(fields,function(current,index){
					if(percentages[index]>0){
						current.textContent=percentages[index]+'%';
					}
					else{
						current.textContent='---';
					}

					

				});

			},

			displayMonth: function(){
				var now,year,month,months;
				months=['January','February','March','April','May','June','July','August','September','October','November','December'];
				now= new Date();
				month=now.getMonth();
				year=now.getFullYear();
				document.querySelector(DOMstrings.dateLabel).textContent=months[month]+ ', '+year;


			},


			getDOMstrings:function(){
				return DOMstrings;
			} //end of getDOMstrings()

		};


	}

	)();

//GLOBAL APP CONTROLLER
var controller=(function(budgetCtrl,UIctrl){

	var setupEventListeners=function(){
		var DOM=UIctrl.getDOMstrings();
		document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);
		document.addEventListener('keypress',function(event){
		if(event.keycode===13 || event.which===13){
			ctrlAddItem();
		}
		});

		document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);

	};

	var updateBudget=function(){

		//1. calculate budget
		budgetCtrl.calculateBudget();

		//2. return budget
		var budget=budgetCtrl.getBudget();

		//3. display the budget on ui
		console.log(budget);
		UIctrl.displayBudget(budget);

	};

	updatePercentages=function(){

		//1. calculate percentages

		budgetCtrl.calculatePercentages()
		//2. read the percentage from the budget controller
		var percentages=budgetCtrl.getPercentages();

		//3. update the ui
		console.log(percentages);
		UIctrl.displayPercentages(percentages);
	};

	

	var ctrlAddItem=function(){
		//1. Get field data
		var input=UIctrl.getInput();
		console.log(input);
		if(input.description!="" && !isNaN(input.value) && input.value>0){
			//2. Add the item to budget controller
		var newItem=budgetCtrl.addItem(input.type,input.description,input.value);
		budgetCtrl.showdata();
		//3. Add the item to UI
		UIctrl.addListItem(newItem,input.type);

		//3.1 clear fields
		UIctrl.clearFields();
		//4. Calc and display budget
		updateBudget();

		//5. Calc and update percentages
		updatePercentages();
		}
		

	};

	var ctrlDeleteItem=function(event){
		var itemID,type,splitID,id;
		itemID=event.target.parentNode.parentNode.parentNode.parentNode.id;
		if(itemID){
			//inc-1
			splitID=itemID.split('-');
			type=splitID[0];
			id=parseInt(splitID[1]);

			//1. Delete the item from the ds
			budgetCtrl.deleteItem(type,id);

			//2. Delete the item from ui
			UIctrl.deleteListItem(itemID);

			//3. Update and show new budget
			updateBudget();

			//4. Calc and update percentages
			updatePercentages();
		}

	};

	return{
		init: function(){
			console.log('App started');
			UIctrl.displayMonth();
			UIctrl.displayBudget({
				budget:0,
				totalInc:0,
				totalExp:0,
				percentage:-1

			});
			setupEventListeners();
		}

	};

	


}
)(budgetController,UIController);
//calling the init() to start the app
controller.init();