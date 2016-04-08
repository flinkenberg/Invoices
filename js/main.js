
var mainMountPoint = 'app';
mainMountPoint = document.getElementById(mainMountPoint);
var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];


invoices.push(
  {
    "id": 387,
    "company": {
      "companyId": 387,
      "companyName": "Ending soon",
      "address": "9 Jay Hill",
      "tel": "62-(687)150-2437",
      "email": "mgriffin2e@dmoz.org"
    },
    "total": 1248,
    "totalCurrency": "USD",
    "service": "vel enim sit amet",
    "dateCreated": Date.now(),
    "dateDue": Date.now() + 172700000
  }
)

// Helper function creating DOM elements based on object provided as an argument.

function $E({type,id,className,mountTo,content,prepend}) {
  var element = document.createElement(type);
  var mountPoint = document.getElementById(mountTo) || this.mainMountPoint;
  element.innerHTML = content || '';
  if (className !== undefined) {
    element.setAttribute('class',className);
  }
  if (id !== undefined) {
    element.id = id;
  }
  if (prepend === true) {
    mountPoint.insertBefore(element,mountPoint.firstChild);
  } else {
    mountPoint.appendChild(element);
  }
}

// Helper function to get custom date result from UNIX timestamp.

function parseDate(timestamp,toReturn) {
  var d = new Date(timestamp);
  var da = d.getDate();
  var mo = d.getMonth()+1;
  var y = d.getFullYear();
  var h = d.getHours();
  var m = d.getMinutes() < 10 ? '0'+d.getMinutes() : d.getMinutes();
  var s = d.getSeconds() < 10 ? '0'+d.getSeconds() : d.getSeconds();
  switch (toReturn) {
    case 'year':
      return  y;
      break;
    case 'month':
      var monthToStr = months[d.getMonth()];
      return monthToStr;
      break;
    case undefined:
      return da+'.'+mo+'.'+y;
      break;
    default: 'year'
  }
}

// Main filter function accepting event object.

function filterList(e) {
  while (invoiceList.firstChild) {
    invoiceList.removeChild(invoiceList.firstChild);
  };
  var rowCount = 0;
  var colCount = 0;
  if (e) {
    var inputVal = e.target.value;
  } else {
    inputVal = invoiceInput.value
  };

  // Create element for saving status of our list

  $E({
    type: 'h2',
    id: 'listStatus',
    mountTo: 'invoiceList',
    prepend: true,
    content: 'Loading . .'
  });
  invoices.filter(function(invoice){
    if (

      // Check if any of following properties match user's input

      ('#'+invoice.id).toString().indexOf(inputVal.toLowerCase()) !== -1 ||
      invoice.company.companyName.toLowerCase().indexOf(inputVal.toLowerCase()) !== -1 ||
      invoice.company.tel.toString().toLowerCase().indexOf(inputVal.toLowerCase()) !== -1 ||
      invoice.total.toString().indexOf(inputVal.toLowerCase()) !== -1 ||
      invoice.totalCurrency.toString().toLowerCase().indexOf(inputVal.toLowerCase()) !== -1 ||
      parseDate(invoice.dateCreated).toString().indexOf(inputVal.toLowerCase()) !== -1 ||
      parseDate(invoice.dateDue).toString().indexOf(inputVal.toLowerCase()) !== -1 ||
      (parseDate(invoice.dateCreated,'month').toString().toLowerCase() + ' ' + parseDate(invoice.dateCreated,'year').toString()).indexOf(inputVal.toLowerCase()) !== -1 ||
      (parseDate(invoice.dateDue,'month').toString().toLowerCase() + ' ' + parseDate(invoice.dateDue,'year').toString()).indexOf(inputVal.toLowerCase()) !== -1 ||
      parseDate(invoice.dateDue,'year').toString().indexOf(inputVal.toLowerCase()) !== -1 ||
      parseDate(invoice.dateCreated,'month').toString().toLowerCase().indexOf(inputVal.toLowerCase()) !== -1 ||
      parseDate(invoice.dateDue,'month').toString().toLowerCase().indexOf(inputVal.toLowerCase()) !== -1
      )
    {

      // Add DOM elements.

      $E({
        type: 'li',
        className: 'invoice-item',
        id: invoice.id,
        mountTo: 'invoiceList'
      });
      colCount++;
      $E({
        type: 'div',
        className: 'invoice-item-col id',
        mountTo: invoice.id,
        content: invoice.id
      });
      colCount++;
      $E({
        type: 'div',
        className: 'invoice-item-col companyName',
        mountTo: invoice.id,
        content: invoice.company.companyName
      });
      colCount++;
      $E({
        type: 'div',
        className: (function(){
          if (invoice.dateDue < Date.now()) {
            return 'invoice-item-col dateDue status danger';
          } else if (invoice.dateDue < (Date.now() + 172800000)) {
            return 'invoice-item-col dateDue status warning';
          } else {
            return 'invoice-item-col dateDue';
          }
        }()),
        // className: invoice.dateDue > Date.now() ? 'invoice-item-col dateDue' : 'invoice-item-col dateDue status warning',
        mountTo: invoice.id,
        content: parseDate(invoice.dateDue)
      });
      colCount++;
      $E({
        type: 'div',
        className: 'invoice-item-col dateCreated',
        mountTo: invoice.id,
        content: parseDate(invoice.dateCreated)
      });
      colCount++;
      $E({
        type: 'div',
        className: 'invoice-item-col total',
        mountTo: invoice.id,
        content: invoice.totalCurrency+' '+invoice.total
      });
      colCount++;
      $E({
        type: 'div',
        className: 'invoice-item-col tel',
        mountTo: invoice.id,
        content: invoice.company.tel
      });
      rowCount++;
      colCount = 0;
    };
  });
  listStatus.innerHTML = rowCount+' '+(rowCount === 1 ? ' record' : 'records')+' of '+invoices.length+' total';
  window.clearTimeout(this.timeoutOne);
}

// Sort by key as presented in JSON

function sortByKey(key,subkey,sortBy) {
  if (!event) {

    // If called on load and sortBy option provided directly.

    var target = document.getElementById(sortBy);
  } else {

    // If sortBy option is a subject of click event.

    var target = event.target;
  }
  while (invoiceList.firstChild) {
    invoiceList.removeChild(invoiceList.firstChild);
  };

  // Check which sortBy button is selected and what state is it in, then perform a Sort method based on keys provided.

  if (target.hasAttribute('class') === false) {
    document.querySelector('#sortListOptions .ascendant') ? document.querySelector('#sortListOptions .ascendant').removeAttribute('class') : null;
    document.querySelector('#sortListOptions .descendant') ? document.querySelector('#sortListOptions .descendant').removeAttribute('class') : null;
  };
  if (target.getAttribute('class') === 'descendant') {
    target.setAttribute('class','ascendant');
    invoices.sort(function(a, b){
      var x, y;
      if (subkey) {
        x = a[key][subkey];
        y = b[key][subkey];
      } else {
        x = a[key];
        y = b[key];
      };
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
    filterList();;
  } else {
    target.setAttribute('class','descendant');
    invoices.sort(function(a, b){
      var x, y;
      if (subkey) {
        x = a[key][subkey];
        y = b[key][subkey];
      } else {
        x = a[key];
        y = b[key];
      };
      return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
    filterList();
  }
}

// Check which button was pressed to call sort fn.

function sortOption(event) {
  switch (event.target.id) {
    case 'sortById':
      sortByKey('id',null);
      break;
    case 'sortByName':
      sortByKey('company','companyName');
      break;
    case 'sortByDue':
      sortByKey('dateDue',null);
      break;
    case 'sortByDate':
      sortByKey('dateCreated',null);
      break;
    case 'sortByTotal':
      sortByKey('total',null);
      break;
    case 'sortByTel':
      sortByKey('company','tel');
      break;
    default: 'sortByDate'
  }
}

// Load saved companies.

function loadCompanies() {
  while (companiesList.firstChild) {
    companiesList.removeChild(companiesList.firstChild);
  };
  companies.forEach(function(company){
    if (company.companyName) {
      $E({
        type: 'option',
        mountTo: 'companiesList',
        content: company.companyName
      });
    }
  });
  return companies;
}

// Assign event listeners

if (this.invoiceInput) {
  invoiceInput.addEventListener('load',sortByKey('id',null,'sortById'),false);
  invoiceInput.addEventListener('keyup',filterList,false);
  invoiceInput.focus();
}
if (this.sortListOptions) {
  sortListOptions.addEventListener('click',sortOption,false);
}
if (this.companiesList) {
  companiesList.addEventListener('load',loadCompanies(),false);
}
