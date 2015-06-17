$.fn.printCalendar = function() {
  return new $.Calendar(this);
};

$.Calendar = function(el) {
  this.$el = $(el);
  this.month = this.month || "jan";
  this.numDays = {
    "jan": 31,
    "feb": 28,
    "march": 31,
    "april": 30,
    "may": 31,
    "june": 30,
    "july":31,
    "aug":31,
    "sep": 30,
    "oct": 31,
    "nov":30,
    "dec":31
  };
  this.startIndex = this.startIndex || 0;
  this.printMonth();
  this.handleClick();
};

$.Calendar.prototype.printMonth = function(button) {
  var calArray = [[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0], [0,0,0,0,0,0,0]];

  var totalDays = this.numDays[this.month];
  var currentDay = 1;

  var firstRow = calArray[0];

  if (button === "prev") {
    // calculate the new starting index
    //1. calc "current", i.e. before click's month's start index
    //2. calc "prev", i.e. what's about to be printed month's start index
    // this.endIndex & this.endMonth ("current")
    // this.month ("prev")

    var lastRowDays = this.endIndex + 1;
    var lastLeftover = this.numDays[this.endMonth] - lastRowDays;

    while (lastLeftover > 7) {
      lastLeftover -= 7;
    }

    // prev month end would be lastLeftover
    var prevMonthDays = this.numDays[this.month];
    var leftover = this.numDays[this.month] - (7 - lastLeftover);
    while (leftover > 7) {
      leftover -= 7;
    }

    this.startIndex = 7 - leftover;

  }

  if (button === "next") {
    this.startIndex = this.endIndex + 1;
  }

  $(".row").remove();
  $(".monthname").html(this.month);

  for (var i = this.startIndex; i < 7; i++) {
    firstRow[i] = currentDay;
    currentDay += 1;
  }

  while (currentDay < totalDays) {
    for (var row = 1; row < calArray.length; row++) {
      if (row === 5 && currentDay > totalDays) {
        break;
      }
      for (var j = 0; j < 7; j++) {
        calArray[row][j] = currentDay;
        currentDay += 1;
        if (currentDay > totalDays) {
          this.endIndex = j;
          this.endMonth = this.month;
          break;
        }
      }
    }
  }

  this.renderCalHtml(calArray);

};

$.Calendar.prototype.renderCalHtml = function(calArray) {
  for (var i = 0; i < calArray.length; i++) {
    var currentRow = calArray[i];
    if (this.allZeros(currentRow)) {

    }
    else {
      var $row = $("<div class='row'></div>");
      this.$el.append($row);
      for (var j = 0; j < 7; j++) {
        var $day = $("<div class='day'></div>");
        if (calArray[i][j]) {
          $day.html(calArray[i][j]);
        }
        $row.append($day);
      }
    }
  }
};

$.Calendar.prototype.allZeros = function(arr) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] !== 0) {
      return false;
    }
  }
  return true;
};

$.Calendar.prototype.handleClick = function() {
  var that = this;
  $("button").on("click", function(event) {
    var buttonName = event.currentTarget.className;
    if ((buttonName === "next" && that.month === "dec") || (buttonName === "prev" && that.month === "jan")) {

    }

    else {
      that.month = that.getNextMonth(buttonName);
      that.printMonth(buttonName);
    }
  });
};

$.Calendar.prototype.getNextMonth = function(button) {
  var months = ["jan", "feb", "march", "april", "may", "june", "july", "aug", "sep", "oct", "nov", "dec"];
  var currentMonthIdx = months.indexOf(this.month);
  if (button === "next") {
    return months[currentMonthIdx + 1];
  } else {
    return months[currentMonthIdx - 1];
  }
};
