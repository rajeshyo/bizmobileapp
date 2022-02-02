var WeekViewComponent_1;
import { __decorate } from "tslib";
import { DatePipe } from '@angular/common';
import { Component, OnInit, OnChanges, HostBinding, Input, Output, EventEmitter, SimpleChanges, ViewChild, ViewEncapsulation, TemplateRef, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { CalendarService } from './calendar.service';
let WeekViewComponent = WeekViewComponent_1 = class WeekViewComponent {
    constructor(calendarService, elm) {
        this.calendarService = calendarService;
        this.elm = elm;
        this.class = true;
        this.autoSelect = true;
        this.dir = '';
        this.scrollToHour = 0;
        this.onRangeChanged = new EventEmitter();
        this.onEventSelected = new EventEmitter();
        this.onTimeSelected = new EventEmitter();
        this.onDayHeaderSelected = new EventEmitter();
        this.onTitleChanged = new EventEmitter(true);
        this.views = [];
        this.currentViewIndex = 0;
        this.direction = 0;
        this.mode = 'week';
        this.inited = false;
        this.callbackOnInit = true;
    }
    static createDateObjects(startTime, startHour, endHour, timeInterval) {
        const times = [], currentHour = 0, currentDate = startTime.getDate();
        let hourStep, minStep;
        if (timeInterval < 1) {
            hourStep = Math.floor(1 / timeInterval);
            minStep = 60;
        }
        else {
            hourStep = 1;
            minStep = Math.floor(60 / timeInterval);
        }
        for (let hour = startHour; hour < endHour; hour += hourStep) {
            for (let interval = 0; interval < 60; interval += minStep) {
                const row = [];
                for (let day = 0; day < 7; day += 1) {
                    const time = new Date(startTime.getTime());
                    time.setHours(currentHour + hour, interval);
                    time.setDate(currentDate + day);
                    row.push({
                        events: [],
                        time
                    });
                }
                times.push(row);
            }
        }
        return times;
    }
    static getDates(startTime, n) {
        const dates = new Array(n), current = new Date(startTime.getTime());
        let i = 0;
        while (i < n) {
            dates[i++] = {
                date: new Date(current.getTime()),
                events: [],
                dayHeader: ''
            };
            current.setDate(current.getDate() + 1);
        }
        return dates;
    }
    static compareEventByStartOffset(eventA, eventB) {
        return eventA.startOffset - eventB.startOffset;
    }
    static calculateWidth(orderedEvents, size, hourParts) {
        const totalSize = size * hourParts, cells = new Array(totalSize);
        // sort by position in descending order, the right most columns should be calculated first
        orderedEvents.sort((eventA, eventB) => {
            return eventB.position - eventA.position;
        });
        for (let i = 0; i < totalSize; i += 1) {
            cells[i] = {
                calculated: false,
                events: []
            };
        }
        const len = orderedEvents.length;
        for (let i = 0; i < len; i += 1) {
            const event = orderedEvents[i];
            let index = event.startIndex * hourParts + event.startOffset;
            while (index < event.endIndex * hourParts - event.endOffset) {
                cells[index].events.push(event);
                index += 1;
            }
        }
        let i = 0;
        while (i < len) {
            let event = orderedEvents[i];
            if (!event.overlapNumber) {
                const overlapNumber = event.position + 1;
                event.overlapNumber = overlapNumber;
                const eventQueue = [event];
                while (event = eventQueue.shift()) {
                    let index = event.startIndex * hourParts + event.startOffset;
                    while (index < event.endIndex * hourParts - event.endOffset) {
                        if (!cells[index].calculated) {
                            cells[index].calculated = true;
                            if (cells[index].events) {
                                const eventCountInCell = cells[index].events.length;
                                for (let j = 0; j < eventCountInCell; j += 1) {
                                    const currentEventInCell = cells[index].events[j];
                                    if (!currentEventInCell.overlapNumber) {
                                        currentEventInCell.overlapNumber = overlapNumber;
                                        eventQueue.push(currentEventInCell);
                                    }
                                }
                            }
                        }
                        index += 1;
                    }
                }
            }
            i += 1;
        }
    }
    ngOnInit() {
        if (!this.sliderOptions) {
            this.sliderOptions = {};
        }
        this.sliderOptions.loop = true;
        this.hourRange = (this.endHour - this.startHour) * this.hourSegments;
        if (this.dateFormatter && this.dateFormatter.formatWeekViewDayHeader) {
            this.formatDayHeader = this.dateFormatter.formatWeekViewDayHeader;
        }
        else {
            const datePipe = new DatePipe(this.locale);
            this.formatDayHeader = function (date) {
                return datePipe.transform(date, this.formatWeekViewDayHeader);
            };
        }
        if (this.dateFormatter && this.dateFormatter.formatWeekViewTitle) {
            this.formatTitle = this.dateFormatter.formatWeekViewTitle;
        }
        else {
            const datePipe = new DatePipe(this.locale);
            this.formatTitle = function (date) {
                return datePipe.transform(date, this.formatWeekTitle);
            };
        }
        if (this.dateFormatter && this.dateFormatter.formatWeekViewHourColumn) {
            this.formatHourColumnLabel = this.dateFormatter.formatWeekViewHourColumn;
        }
        else {
            const datePipe = new DatePipe(this.locale);
            this.formatHourColumnLabel = function (date) {
                return datePipe.transform(date, this.formatHourColumn);
            };
        }
        if (this.lockSwipeToPrev) {
            this.slider.lockSwipeToPrev(true);
        }
        if (this.lockSwipes) {
            this.slider.lockSwipes(true);
        }
        this.refreshView();
        this.hourColumnLabels = this.getHourColumnLabels();
        this.inited = true;
        this.currentDateChangedFromParentSubscription = this.calendarService.currentDateChangedFromParent$.subscribe(currentDate => {
            this.refreshView();
        });
        this.eventSourceChangedSubscription = this.calendarService.eventSourceChanged$.subscribe(() => {
            this.onDataLoaded();
        });
        this.slideChangedSubscription = this.calendarService.slideChanged$.subscribe(direction => {
            if (direction === 1) {
                this.slider.slideNext();
            }
            else if (direction === -1) {
                this.slider.slidePrev();
            }
        });
        this.slideUpdatedSubscription = this.calendarService.slideUpdated$.subscribe(() => {
            this.slider.update();
        });
    }
    ngAfterViewInit() {
        const title = this.getTitle();
        this.onTitleChanged.emit(title);
        if (this.scrollToHour > 0) {
            const hourColumns = this.elm.nativeElement.querySelector('.weekview-normal-event-container').querySelectorAll('.calendar-hour-column');
            const me = this;
            setTimeout(() => {
                me.initScrollPosition = hourColumns[me.scrollToHour - me.startHour].offsetTop;
            }, 50);
        }
    }
    ngOnChanges(changes) {
        if (!this.inited) {
            return;
        }
        if ((changes.startHour || changes.endHour) && (!changes.startHour.isFirstChange() || !changes.endHour.isFirstChange())) {
            this.views = undefined;
            this.hourRange = (this.endHour - this.startHour) * this.hourSegments;
            this.direction = 0;
            this.refreshView();
            this.hourColumnLabels = this.getHourColumnLabels();
        }
        const eventSourceChange = changes.eventSource;
        if (eventSourceChange && eventSourceChange.currentValue) {
            this.onDataLoaded();
        }
        const lockSwipeToPrev = changes.lockSwipeToPrev;
        if (lockSwipeToPrev) {
            this.slider.lockSwipeToPrev(lockSwipeToPrev.currentValue);
        }
        const lockSwipes = changes.lockSwipes;
        if (lockSwipes) {
            this.slider.lockSwipes(lockSwipes.currentValue);
        }
    }
    ngOnDestroy() {
        if (this.currentDateChangedFromParentSubscription) {
            this.currentDateChangedFromParentSubscription.unsubscribe();
            this.currentDateChangedFromParentSubscription = null;
        }
        if (this.eventSourceChangedSubscription) {
            this.eventSourceChangedSubscription.unsubscribe();
            this.eventSourceChangedSubscription = null;
        }
        if (this.slideChangedSubscription) {
            this.slideChangedSubscription.unsubscribe();
            this.slideChangedSubscription = null;
        }
        if (this.slideUpdatedSubscription) {
            this.slideUpdatedSubscription.unsubscribe();
            this.slideUpdatedSubscription = null;
        }
    }
    onSlideChanged() {
        if (this.callbackOnInit) {
            this.callbackOnInit = false;
            return;
        }
        const currentViewIndex = this.currentViewIndex;
        let direction = 0;
        this.slider.getActiveIndex().then(currentSlideIndex => {
            currentSlideIndex = (currentSlideIndex + 2) % 3;
            if (isNaN(currentSlideIndex)) {
                currentSlideIndex = currentViewIndex;
            }
            if (currentSlideIndex - currentViewIndex === 1) {
                direction = 1;
            }
            else if (currentSlideIndex === 0 && currentViewIndex === 2) {
                direction = 1;
                this.slider.slideTo(1, 0, false);
            }
            else if (currentViewIndex - currentSlideIndex === 1) {
                direction = -1;
            }
            else if (currentSlideIndex === 2 && currentViewIndex === 0) {
                direction = -1;
                this.slider.slideTo(3, 0, false);
            }
            this.currentViewIndex = currentSlideIndex;
            this.move(direction);
        });
    }
    move(direction) {
        if (direction === 0) {
            return;
        }
        this.direction = direction;
        const adjacent = this.calendarService.getAdjacentCalendarDate(this.mode, direction);
        this.calendarService.setCurrentDate(adjacent);
        this.refreshView();
        this.direction = 0;
    }
    getHourColumnLabels() {
        const hourColumnLabels = [];
        for (let hour = 0, length = this.views[0].rows.length; hour < length; hour += 1) {
            // handle edge case for DST
            if (hour === 0 && this.views[0].rows[hour][0].time.getHours() !== this.startHour) {
                const time = new Date(this.views[0].rows[hour][0].time);
                time.setDate(time.getDate() + 1);
                time.setHours(this.startHour);
                hourColumnLabels.push(this.formatHourColumnLabel(time));
            }
            else {
                hourColumnLabels.push(this.formatHourColumnLabel(this.views[0].rows[hour][0].time));
            }
        }
        return hourColumnLabels;
    }
    getViewData(startTime) {
        const dates = WeekViewComponent_1.getDates(startTime, 7);
        for (let i = 0; i < 7; i++) {
            dates[i].dayHeader = this.formatDayHeader(dates[i].date);
        }
        return {
            rows: WeekViewComponent_1.createDateObjects(startTime, this.startHour, this.endHour, this.hourSegments),
            dates
        };
    }
    getRange(currentDate) {
        const year = currentDate.getFullYear(), month = currentDate.getMonth(), date = currentDate.getDate(), day = currentDate.getDay();
        let difference = day - this.startingDayWeek;
        if (difference < 0) {
            difference += 7;
        }
        // set hour to 12 to avoid DST problem
        const firstDayOfWeek = new Date(year, month, date - difference, 12, 0, 0), endTime = new Date(year, month, date - difference + 7, 12, 0, 0);
        return {
            startTime: firstDayOfWeek,
            endTime
        };
    }
    onDataLoaded() {
        const eventSource = this.eventSource, len = eventSource ? eventSource.length : 0, startTime = this.range.startTime, endTime = this.range.endTime, utcStartTime = Date.UTC(startTime.getFullYear(), startTime.getMonth(), startTime.getDate()), utcEndTime = Date.UTC(endTime.getFullYear(), endTime.getMonth(), endTime.getDate()), currentViewIndex = this.currentViewIndex, rows = this.views[currentViewIndex].rows, dates = this.views[currentViewIndex].dates, oneHour = 3600000, oneDay = 86400000, 
        // add allday eps
        eps = 0.016, rangeStartRowIndex = this.startHour * this.hourSegments, rangeEndRowIndex = this.endHour * this.hourSegments, allRows = 24 * this.hourSegments;
        let allDayEventInRange = false, normalEventInRange = false;
        for (let i = 0; i < 7; i += 1) {
            dates[i].events = [];
            dates[i].hasEvent = false;
        }
        for (let day = 0; day < 7; day += 1) {
            for (let hour = 0; hour < this.hourRange; hour += 1) {
                rows[hour][day].events = [];
            }
        }
        for (let i = 0; i < len; i += 1) {
            const event = eventSource[i];
            const eventStartTime = event.startTime;
            const eventEndTime = event.endTime;
            let eventUTCStartTime, eventUTCEndTime;
            if (event.allDay) {
                eventUTCStartTime = eventStartTime.getTime();
                eventUTCEndTime = eventEndTime.getTime();
            }
            else {
                eventUTCStartTime = Date.UTC(eventStartTime.getFullYear(), eventStartTime.getMonth(), eventStartTime.getDate());
                eventUTCEndTime = Date.UTC(eventEndTime.getFullYear(), eventEndTime.getMonth(), eventEndTime.getDate() + 1);
            }
            if (eventUTCEndTime <= utcStartTime || eventUTCStartTime >= utcEndTime || eventStartTime >= eventEndTime) {
                continue;
            }
            if (event.allDay) {
                allDayEventInRange = true;
                let allDayStartIndex;
                if (eventUTCStartTime <= utcStartTime) {
                    allDayStartIndex = 0;
                }
                else {
                    allDayStartIndex = Math.round((eventUTCStartTime - utcStartTime) / oneDay);
                }
                let allDayEndIndex;
                if (eventUTCEndTime >= utcEndTime) {
                    allDayEndIndex = Math.round((utcEndTime - utcStartTime) / oneDay);
                }
                else {
                    allDayEndIndex = Math.round((eventUTCEndTime - utcStartTime) / oneDay);
                }
                const displayAllDayEvent = {
                    event,
                    startIndex: allDayStartIndex,
                    endIndex: allDayEndIndex
                };
                let eventSet = dates[allDayStartIndex].events;
                if (eventSet) {
                    eventSet.push(displayAllDayEvent);
                }
                else {
                    eventSet = [];
                    eventSet.push(displayAllDayEvent);
                    dates[allDayStartIndex].events = eventSet;
                }
                dates[allDayStartIndex].hasEvent = true;
            }
            else {
                normalEventInRange = true;
                let timeDifferenceStart;
                if (eventUTCStartTime < utcStartTime) {
                    timeDifferenceStart = 0;
                }
                else {
                    timeDifferenceStart = (eventUTCStartTime - utcStartTime) / oneHour * this.hourSegments + (eventStartTime.getHours() + eventStartTime.getMinutes() / 60) * this.hourSegments;
                }
                let timeDifferenceEnd;
                if (eventUTCEndTime > utcEndTime) {
                    timeDifferenceEnd = (utcEndTime - utcStartTime) / oneHour * this.hourSegments;
                }
                else {
                    timeDifferenceEnd = (eventUTCEndTime - oneDay - utcStartTime) / oneHour * this.hourSegments + (eventEndTime.getHours() + eventEndTime.getMinutes() / 60) * this.hourSegments;
                }
                const startIndex = Math.floor(timeDifferenceStart), endIndex = Math.ceil(timeDifferenceEnd - eps);
                let startRowIndex = startIndex % allRows, dayIndex = Math.floor(startIndex / allRows), endOfDay = dayIndex * allRows, startOffset = 0, endOffset = 0;
                if (this.hourParts !== 1) {
                    if (startRowIndex < rangeStartRowIndex) {
                        startOffset = 0;
                    }
                    else {
                        startOffset = Math.floor((timeDifferenceStart - startIndex) * this.hourParts);
                    }
                }
                do {
                    endOfDay += allRows;
                    let endRowIndex;
                    if (endOfDay < endIndex) {
                        endRowIndex = allRows;
                    }
                    else {
                        if (endOfDay === endIndex) {
                            endRowIndex = allRows;
                        }
                        else {
                            endRowIndex = endIndex % allRows;
                        }
                        if (this.hourParts !== 1) {
                            if (endRowIndex > rangeEndRowIndex) {
                                endOffset = 0;
                            }
                            else {
                                endOffset = Math.floor((endIndex - timeDifferenceEnd) * this.hourParts);
                            }
                        }
                    }
                    if (startRowIndex < rangeStartRowIndex) {
                        startRowIndex = 0;
                    }
                    else {
                        startRowIndex -= rangeStartRowIndex;
                    }
                    if (endRowIndex > rangeEndRowIndex) {
                        endRowIndex = rangeEndRowIndex;
                    }
                    endRowIndex -= rangeStartRowIndex;
                    if (startRowIndex < endRowIndex) {
                        const displayEvent = {
                            event,
                            startIndex: startRowIndex,
                            endIndex: endRowIndex,
                            startOffset,
                            endOffset
                        };
                        let eventSet = rows[startRowIndex][dayIndex].events;
                        if (eventSet) {
                            eventSet.push(displayEvent);
                        }
                        else {
                            eventSet = [];
                            eventSet.push(displayEvent);
                            rows[startRowIndex][dayIndex].events = eventSet;
                        }
                        dates[dayIndex].hasEvent = true;
                    }
                    startRowIndex = 0;
                    startOffset = 0;
                    dayIndex += 1;
                } while (endOfDay < endIndex);
            }
        }
        if (normalEventInRange) {
            for (let day = 0; day < 7; day += 1) {
                let orderedEvents = [];
                for (let hour = 0; hour < this.hourRange; hour += 1) {
                    if (rows[hour][day].events) {
                        rows[hour][day].events.sort(WeekViewComponent_1.compareEventByStartOffset);
                        orderedEvents = orderedEvents.concat(rows[hour][day].events);
                    }
                }
                if (orderedEvents.length > 0) {
                    this.placeEvents(orderedEvents);
                }
            }
        }
        if (allDayEventInRange) {
            let orderedAllDayEvents = [];
            for (let day = 0; day < 7; day += 1) {
                if (dates[day].events) {
                    orderedAllDayEvents = orderedAllDayEvents.concat(dates[day].events);
                }
            }
            if (orderedAllDayEvents.length > 0) {
                this.placeAllDayEvents(orderedAllDayEvents);
            }
        }
        if (this.autoSelect) {
            let findSelected = false;
            let selectedDate;
            for (let r = 0; r < 7; r += 1) {
                if (dates[r].selected) {
                    selectedDate = dates[r];
                    findSelected = true;
                    break;
                }
            }
            if (findSelected) {
                let disabled = false;
                if (this.markDisabled) {
                    disabled = this.markDisabled(selectedDate.date);
                }
                this.onTimeSelected.emit({
                    selectedTime: selectedDate.date,
                    events: selectedDate.events.map(e => e.event),
                    disabled
                });
            }
        }
    }
    refreshView() {
        this.range = this.getRange(this.calendarService.currentDate);
        if (this.inited) {
            const title = this.getTitle();
            this.onTitleChanged.emit(title);
        }
        this.calendarService.populateAdjacentViews(this);
        this.updateCurrentView(this.range.startTime, this.views[this.currentViewIndex]);
        this.calendarService.rangeChanged(this);
    }
    getTitle() {
        const firstDayOfWeek = new Date(this.range.startTime.getTime());
        firstDayOfWeek.setHours(12, 0, 0, 0);
        return this.formatTitle(firstDayOfWeek);
    }
    getHighlightClass(date) {
        let className = '';
        if (date.hasEvent) {
            if (className) {
                className += ' ';
            }
            className = 'weekview-with-event';
        }
        if (date.selected) {
            if (className) {
                className += ' ';
            }
            className += 'weekview-selected';
        }
        if (date.current) {
            if (className) {
                className += ' ';
            }
            className += 'weekview-current';
        }
        return className;
    }
    select(selectedTime, events) {
        let disabled = false;
        if (this.markDisabled) {
            disabled = this.markDisabled(selectedTime);
        }
        this.onTimeSelected.emit({
            selectedTime,
            events: events.map(e => e.event),
            disabled
        });
    }
    placeEvents(orderedEvents) {
        this.calculatePosition(orderedEvents);
        WeekViewComponent_1.calculateWidth(orderedEvents, this.hourRange, this.hourParts);
    }
    placeAllDayEvents(orderedEvents) {
        this.calculatePosition(orderedEvents);
    }
    overlap(event1, event2) {
        let earlyEvent = event1, lateEvent = event2;
        if (event1.startIndex > event2.startIndex || (event1.startIndex === event2.startIndex && event1.startOffset > event2.startOffset)) {
            earlyEvent = event2;
            lateEvent = event1;
        }
        if (earlyEvent.endIndex <= lateEvent.startIndex) {
            return false;
        }
        else {
            return !(earlyEvent.endIndex - lateEvent.startIndex === 1 && earlyEvent.endOffset + lateEvent.startOffset >= this.hourParts);
        }
    }
    calculatePosition(events) {
        const len = events.length, isForbidden = new Array(len);
        let maxColumn = 0;
        for (let i = 0; i < len; i += 1) {
            let col;
            for (col = 0; col < maxColumn; col += 1) {
                isForbidden[col] = false;
            }
            for (let j = 0; j < i; j += 1) {
                if (this.overlap(events[i], events[j])) {
                    isForbidden[events[j].position] = true;
                }
            }
            for (col = 0; col < maxColumn; col += 1) {
                if (!isForbidden[col]) {
                    break;
                }
            }
            if (col < maxColumn) {
                events[i].position = col;
            }
            else {
                events[i].position = maxColumn++;
            }
        }
        if (this.dir === 'rtl') {
            for (let i = 0; i < len; i += 1) {
                events[i].position = maxColumn - 1 - events[i].position;
            }
        }
    }
    updateCurrentView(currentViewStartDate, view) {
        const currentCalendarDate = this.calendarService.currentDate, today = new Date(), oneDay = 86400000, selectedDayDifference = Math.round((Date.UTC(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth(), currentCalendarDate.getDate()) - Date.UTC(currentViewStartDate.getFullYear(), currentViewStartDate.getMonth(), currentViewStartDate.getDate())) / oneDay), currentDayDifference = Math.floor((Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) - Date.UTC(currentViewStartDate.getFullYear(), currentViewStartDate.getMonth(), currentViewStartDate.getDate())) / oneDay);
        for (let r = 0; r < 7; r += 1) {
            view.dates[r].selected = false;
        }
        if (selectedDayDifference >= 0 && selectedDayDifference < 7 && this.autoSelect) {
            view.dates[selectedDayDifference].selected = true;
        }
        if (currentDayDifference >= 0 && currentDayDifference < 7) {
            view.dates[currentDayDifference].current = true;
        }
    }
    daySelected(viewDate) {
        const selectedDate = viewDate.date, dates = this.views[this.currentViewIndex].dates, currentViewStartDate = this.range.startTime, oneDay = 86400000, selectedDayDifference = Math.round((Date.UTC(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()) - Date.UTC(currentViewStartDate.getFullYear(), currentViewStartDate.getMonth(), currentViewStartDate.getDate())) / oneDay);
        this.calendarService.setCurrentDate(selectedDate);
        for (let r = 0; r < 7; r += 1) {
            dates[r].selected = false;
        }
        if (selectedDayDifference >= 0 && selectedDayDifference < 7) {
            dates[selectedDayDifference].selected = true;
        }
        let disabled = false;
        if (this.markDisabled) {
            disabled = this.markDisabled(selectedDate);
        }
        this.onDayHeaderSelected.emit({ selectedTime: selectedDate, events: viewDate.events.map(e => e.event), disabled });
    }
    setScrollPosition(scrollPosition) {
        this.initScrollPosition = scrollPosition;
    }
};
WeekViewComponent.ctorParameters = () => [
    { type: CalendarService },
    { type: ElementRef }
];
__decorate([
    ViewChild('weekSlider', { static: true })
], WeekViewComponent.prototype, "slider", void 0);
__decorate([
    HostBinding('class.weekview')
], WeekViewComponent.prototype, "class", void 0);
__decorate([
    Input()
], WeekViewComponent.prototype, "weekviewHeaderTemplate", void 0);
__decorate([
    Input()
], WeekViewComponent.prototype, "weekviewAllDayEventTemplate", void 0);
__decorate([
    Input()
], WeekViewComponent.prototype, "weekviewNormalEventTemplate", void 0);
__decorate([
    Input()
], WeekViewComponent.prototype, "weekviewAllDayEventSectionTemplate", void 0);
__decorate([
    Input()
], WeekViewComponent.prototype, "weekviewNormalEventSectionTemplate", void 0);
__decorate([
    Input()
], WeekViewComponent.prototype, "weekviewInactiveAllDayEventSectionTemplate", void 0);
__decorate([
    Input()
], WeekViewComponent.prototype, "weekviewInactiveNormalEventSectionTemplate", void 0);
__decorate([
    Input()
], WeekViewComponent.prototype, "formatWeekTitle", void 0);
__decorate([
    Input()
], WeekViewComponent.prototype, "formatWeekViewDayHeader", void 0);
__decorate([
    Input()
], WeekViewComponent.prototype, "formatHourColumn", void 0);
__decorate([
    Input()
], WeekViewComponent.prototype, "startingDayWeek", void 0);
__decorate([
    Input()
], WeekViewComponent.prototype, "allDayLabel", void 0);
__decorate([
    Input()
], WeekViewComponent.prototype, "hourParts", void 0);
__decorate([
    Input()
], WeekViewComponent.prototype, "eventSource", void 0);
__decorate([
    Input()
], WeekViewComponent.prototype, "autoSelect", void 0);
__decorate([
    Input()
], WeekViewComponent.prototype, "markDisabled", void 0);
__decorate([
    Input()
], WeekViewComponent.prototype, "locale", void 0);
__decorate([
    Input()
], WeekViewComponent.prototype, "dateFormatter", void 0);
__decorate([
    Input()
], WeekViewComponent.prototype, "dir", void 0);
__decorate([
    Input()
], WeekViewComponent.prototype, "scrollToHour", void 0);
__decorate([
    Input()
], WeekViewComponent.prototype, "preserveScrollPosition", void 0);
__decorate([
    Input()
], WeekViewComponent.prototype, "lockSwipeToPrev", void 0);
__decorate([
    Input()
], WeekViewComponent.prototype, "lockSwipes", void 0);
__decorate([
    Input()
], WeekViewComponent.prototype, "startHour", void 0);
__decorate([
    Input()
], WeekViewComponent.prototype, "endHour", void 0);
__decorate([
    Input()
], WeekViewComponent.prototype, "sliderOptions", void 0);
__decorate([
    Input()
], WeekViewComponent.prototype, "hourSegments", void 0);
__decorate([
    Output()
], WeekViewComponent.prototype, "onRangeChanged", void 0);
__decorate([
    Output()
], WeekViewComponent.prototype, "onEventSelected", void 0);
__decorate([
    Output()
], WeekViewComponent.prototype, "onTimeSelected", void 0);
__decorate([
    Output()
], WeekViewComponent.prototype, "onDayHeaderSelected", void 0);
__decorate([
    Output()
], WeekViewComponent.prototype, "onTitleChanged", void 0);
WeekViewComponent = WeekViewComponent_1 = __decorate([
    Component({
        selector: 'weekview',
        template: `
        <ion-slides #weekSlider [options]="sliderOptions" [dir]="dir" (ionSlideDidChange)="onSlideChanged()"
                    class="slides-container">
            <ion-slide class="slide-container">
                <table class="table table-bordered table-fixed weekview-header">
                    <thead>
                    <tr>
                        <th class="calendar-hour-column"></th>
                        <th class="weekview-header text-center" *ngFor="let date of views[0].dates"
                            [ngClass]="getHighlightClass(date)"
                            (click)="daySelected(date)">
                            <ng-template [ngTemplateOutlet]="weekviewHeaderTemplate"
                                         [ngTemplateOutletContext]="{viewDate:date}">
                            </ng-template>
                        </th>
                    </tr>
                    </thead>
                </table>
                <div *ngIf="0===currentViewIndex">
                    <div class="weekview-allday-table">
                        <div class="weekview-allday-label">{{allDayLabel}}</div>
                        <div class="weekview-allday-content-wrapper scroll-content">
                            <table class="table table-fixed weekview-allday-content-table">
                                <tbody>
                                <tr>
                                    <td *ngFor="let day of views[0].dates" class="calendar-cell">
                                        <ng-template [ngTemplateOutlet]="weekviewAllDayEventSectionTemplate"
                                                     [ngTemplateOutletContext]="{day:day, eventTemplate:weekviewAllDayEventTemplate}">
                                        </ng-template>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <init-position-scroll class="weekview-normal-event-container" [initPosition]="initScrollPosition"
                                          [emitEvent]="preserveScrollPosition" (onScroll)="setScrollPosition($event)">
                        <table class="table table-bordered table-fixed weekview-normal-event-table">
                            <tbody>
                            <tr *ngFor="let row of views[0].rows; let i = index">
                                <td class="calendar-hour-column text-center">
                                    {{hourColumnLabels[i]}}
                                </td>
                                <td *ngFor="let tm of row" class="calendar-cell" tappable
                                    (click)="select(tm.time, tm.events)">
                                    <ng-template [ngTemplateOutlet]="weekviewNormalEventSectionTemplate"
                                                 [ngTemplateOutletContext]="{tm:tm, hourParts: hourParts, eventTemplate:weekviewNormalEventTemplate}">
                                    </ng-template>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </init-position-scroll>
                </div>
                <div *ngIf="0!==currentViewIndex">
                    <div class="weekview-allday-table">
                        <div class="weekview-allday-label">{{allDayLabel}}</div>
                        <div class="weekview-allday-content-wrapper scroll-content">
                            <table class="table table-fixed weekview-allday-content-table">
                                <tbody>
                                <tr>
                                    <td *ngFor="let day of views[0].dates" class="calendar-cell">
                                        <ng-template [ngTemplateOutlet]="weekviewInactiveAllDayEventSectionTemplate"
                                                     [ngTemplateOutletContext]="{day:day}">
                                        </ng-template>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <init-position-scroll class="weekview-normal-event-container" [initPosition]="initScrollPosition">
                        <table class="table table-bordered table-fixed weekview-normal-event-table">
                            <tbody>
                            <tr *ngFor="let row of views[0].rows; let i = index">
                                <td class="calendar-hour-column text-center">
                                    {{hourColumnLabels[i]}}
                                </td>
                                <td *ngFor="let tm of row" class="calendar-cell">
                                    <ng-template [ngTemplateOutlet]="weekviewInactiveNormalEventSectionTemplate"
                                                 [ngTemplateOutletContext]="{tm:tm, hourParts: hourParts}">
                                    </ng-template>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </init-position-scroll>
                </div>
            </ion-slide>
            <ion-slide class="slide-container">
                <table class="table table-bordered table-fixed weekview-header">
                    <thead>
                    <tr>
                        <th class="calendar-hour-column"></th>
                        <th class="weekview-header text-center" *ngFor="let date of views[1].dates"
                            [ngClass]="getHighlightClass(date)"
                            (click)="daySelected(date)">
                            <ng-template [ngTemplateOutlet]="weekviewHeaderTemplate"
                                         [ngTemplateOutletContext]="{viewDate:date}">
                            </ng-template>
                        </th>
                    </tr>
                    </thead>
                </table>
                <div *ngIf="1===currentViewIndex">
                    <div class="weekview-allday-table">
                        <div class="weekview-allday-label">{{allDayLabel}}</div>
                        <div class="weekview-allday-content-wrapper scroll-content">
                            <table class="table table-fixed weekview-allday-content-table">
                                <tbody>
                                <tr>
                                    <td *ngFor="let day of views[1].dates" class="calendar-cell">
                                        <ng-template [ngTemplateOutlet]="weekviewAllDayEventSectionTemplate"
                                                     [ngTemplateOutletContext]="{day:day, eventTemplate:weekviewAllDayEventTemplate}">
                                        </ng-template>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <init-position-scroll class="weekview-normal-event-container" [initPosition]="initScrollPosition"
                                          [emitEvent]="preserveScrollPosition" (onScroll)="setScrollPosition($event)">
                        <table class="table table-bordered table-fixed weekview-normal-event-table">
                            <tbody>
                            <tr *ngFor="let row of views[1].rows; let i = index">
                                <td class="calendar-hour-column text-center">
                                    {{hourColumnLabels[i]}}
                                </td>
                                <td *ngFor="let tm of row" class="calendar-cell" tappable
                                    (click)="select(tm.time, tm.events)">
                                    <div [ngClass]="{'calendar-event-wrap': tm.events}" *ngIf="tm.events">
                                        <ng-template [ngTemplateOutlet]="weekviewNormalEventSectionTemplate"
                                                     [ngTemplateOutletContext]="{tm:tm, hourParts: hourParts, eventTemplate:weekviewNormalEventTemplate}">
                                        </ng-template>
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </init-position-scroll>
                </div>
                <div *ngIf="1!==currentViewIndex">
                    <div class="weekview-allday-table">
                        <div class="weekview-allday-label">{{allDayLabel}}</div>
                        <div class="weekview-allday-content-wrapper scroll-content">
                            <table class="table table-fixed weekview-allday-content-table">
                                <tbody>
                                <tr>
                                    <td *ngFor="let day of views[1].dates" class="calendar-cell">
                                        <ng-template [ngTemplateOutlet]="weekviewInactiveAllDayEventSectionTemplate"
                                                     [ngTemplateOutletContext]="{day:day}">
                                        </ng-template>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <init-position-scroll class="weekview-normal-event-container" [initPosition]="initScrollPosition">
                        <table class="table table-bordered table-fixed weekview-normal-event-table">
                            <tbody>
                            <tr *ngFor="let row of views[1].rows; let i = index">
                                <td class="calendar-hour-column text-center">
                                    {{hourColumnLabels[i]}}
                                </td>
                                <td *ngFor="let tm of row" class="calendar-cell">
                                    <div [ngClass]="{'calendar-event-wrap': tm.events}" *ngIf="tm.events">
                                        <ng-template [ngTemplateOutlet]="weekviewInactiveNormalEventSectionTemplate"
                                                     [ngTemplateOutletContext]="{tm:tm, hourParts: hourParts}">
                                        </ng-template>
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </init-position-scroll>
                </div>
            </ion-slide>
            <ion-slide class="slide-container">
                <table class="table table-bordered table-fixed weekview-header">
                    <thead>
                    <tr>
                        <th class="calendar-hour-column"></th>
                        <th class="weekview-header text-center" *ngFor="let date of views[2].dates"
                            [ngClass]="getHighlightClass(date)"
                            (click)="daySelected(date)">
                            <ng-template [ngTemplateOutlet]="weekviewHeaderTemplate"
                                         [ngTemplateOutletContext]="{viewDate:date}">
                            </ng-template>
                        </th>
                    </tr>
                    </thead>
                </table>
                <div *ngIf="2===currentViewIndex">
                    <div class="weekview-allday-table">
                        <div class="weekview-allday-label">{{allDayLabel}}</div>
                        <div class="weekview-allday-content-wrapper scroll-content">
                            <table class="table table-fixed weekview-allday-content-table">
                                <tbody>
                                <tr>
                                    <td *ngFor="let day of views[2].dates" class="calendar-cell">
                                        <ng-template [ngTemplateOutlet]="weekviewAllDayEventSectionTemplate"
                                                     [ngTemplateOutletContext]="{day:day, eventTemplate:weekviewAllDayEventTemplate}">
                                        </ng-template>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <init-position-scroll class="weekview-normal-event-container" [initPosition]="initScrollPosition"
                                          [emitEvent]="preserveScrollPosition" (onScroll)="setScrollPosition($event)">
                        <table class="table table-bordered table-fixed weekview-normal-event-table">
                            <tbody>
                            <tr *ngFor="let row of views[2].rows; let i = index">
                                <td class="calendar-hour-column text-center">
                                    {{hourColumnLabels[i]}}
                                </td>
                                <td *ngFor="let tm of row" class="calendar-cell" tappable
                                    (click)="select(tm.time, tm.events)">
                                    <div [ngClass]="{'calendar-event-wrap': tm.events}" *ngIf="tm.events">
                                        <ng-template [ngTemplateOutlet]="weekviewNormalEventSectionTemplate"
                                                     [ngTemplateOutletContext]="{tm:tm, hourParts: hourParts, eventTemplate:weekviewNormalEventTemplate}">
                                        </ng-template>
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </init-position-scroll>
                </div>
                <div *ngIf="2!==currentViewIndex">
                    <div class="weekview-allday-table">
                        <div class="weekview-allday-label">{{allDayLabel}}</div>
                        <div class="weekview-allday-content-wrapper scroll-content">
                            <table class="table table-fixed weekview-allday-content-table">
                                <tbody>
                                <tr>
                                    <td *ngFor="let day of views[2].dates" class="calendar-cell">
                                        <ng-template [ngTemplateOutlet]="weekviewInactiveAllDayEventSectionTemplate"
                                                     [ngTemplateOutletContext]="{day:day}">
                                        </ng-template>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <init-position-scroll class="weekview-normal-event-container" [initPosition]="initScrollPosition">
                        <table class="table table-bordered table-fixed weekview-normal-event-table">
                            <tbody>
                            <tr *ngFor="let row of views[2].rows; let i = index">
                                <td class="calendar-hour-column text-center">
                                    {{hourColumnLabels[i]}}
                                </td>
                                <td *ngFor="let tm of row" class="calendar-cell">
                                    <div [ngClass]="{'calendar-event-wrap': tm.events}" *ngIf="tm.events">
                                        <ng-template [ngTemplateOutlet]="weekviewInactiveNormalEventSectionTemplate"
                                                     [ngTemplateOutletContext]="{tm:tm, hourParts: hourParts}">
                                        </ng-template>
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </init-position-scroll>
                </div>
            </ion-slide>
        </ion-slides>
    `,
        encapsulation: ViewEncapsulation.None,
        styles: [`
        .table-fixed {
            table-layout: fixed;
        }

        .table {
            width: 100%;
            max-width: 100%;
            background-color: transparent;
        }

        .table > thead > tr > th, .table > tbody > tr > th, .table > tfoot > tr > th, .table > thead > tr > td,
        .table > tbody > tr > td, .table > tfoot > tr > td {
            padding: 8px;
            line-height: 20px;
            vertical-align: top;
        }

        .table > thead > tr > th {
            vertical-align: bottom;
            border-bottom: 2px solid #ddd;
        }

        .table > thead:first-child > tr:first-child > th, .table > thead:first-child > tr:first-child > td {
            border-top: 0
        }

        .table > tbody + tbody {
            border-top: 2px solid #ddd;
        }

        .table-bordered {
            border: 1px solid #ddd;
        }

        .table-bordered > thead > tr > th, .table-bordered > tbody > tr > th, .table-bordered > tfoot > tr > th,
        .table-bordered > thead > tr > td, .table-bordered > tbody > tr > td, .table-bordered > tfoot > tr > td {
            border: 1px solid #ddd;
        }

        .table-bordered > thead > tr > th, .table-bordered > thead > tr > td {
            border-bottom-width: 2px;
        }

        .table-striped > tbody > tr:nth-child(odd) > td, .table-striped > tbody > tr:nth-child(odd) > th {
            background-color: #f9f9f9
        }

        .calendar-hour-column {
            width: 50px;
            white-space: nowrap;
        }

        .calendar-event-wrap {
            position: relative;
            width: 100%;
            height: 100%;
        }

        .calendar-event {
            position: absolute;
            padding: 2px;
            cursor: pointer;
            z-index: 10000;
        }

        .calendar-cell {
            padding: 0 !important;
            height: 37px;
        }

        .slides-container {
            height: 100%;
        }

        .slide-container {
            display: block;
        }

        .weekview-allday-label {
            float: left;
            height: 100%;
            line-height: 50px;
            text-align: center;
            width: 50px;
            border-left: 1px solid #ddd;
        }

        [dir="rtl"] .weekview-allday-label {
            float: right;
            border-right: 1px solid #ddd;
        }

        .weekview-allday-content-wrapper {
            margin-left: 50px;
            overflow: hidden;
            height: 51px;
        }

        [dir="rtl"] .weekview-allday-content-wrapper {
            margin-left: 0;
            margin-right: 50px;
        }

        .weekview-allday-content-table {
            min-height: 50px;
        }

        .weekview-allday-content-table td {
            border-left: 1px solid #ddd;
            border-right: 1px solid #ddd;
        }

        .weekview-header th {
            overflow: hidden;
            white-space: nowrap;
            font-size: 14px;
        }

        .weekview-allday-table {
            height: 50px;
            position: relative;
            border-bottom: 1px solid #ddd;
            font-size: 14px;
        }

        .weekview-normal-event-container {
            margin-top: 87px;
            overflow: hidden;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            position: absolute;
            font-size: 14px;
        }

        .scroll-content {
            overflow-y: auto;
            overflow-x: hidden;
        }

        ::-webkit-scrollbar,
        *::-webkit-scrollbar {
            display: none;
        }

        .table > tbody > tr > td.calendar-hour-column {
            padding-left: 0;
            padding-right: 0;
            vertical-align: middle;
        }

        @media (max-width: 750px) {
            .weekview-allday-label, .calendar-hour-column {
                width: 31px;
                font-size: 12px;
            }

            .weekview-allday-label {
                padding-top: 4px;
            }

            .table > tbody > tr > td.calendar-hour-column {
                padding-left: 0;
                padding-right: 0;
                vertical-align: middle;
                line-height: 12px;
            }

            .table > thead > tr > th.weekview-header {
                padding-left: 0;
                padding-right: 0;
                font-size: 12px;
            }

            .weekview-allday-label {
                line-height: 20px;
            }

            .weekview-allday-content-wrapper {
                margin-left: 31px;
            }

            [dir="rtl"] .weekview-allday-content-wrapper {
                margin-left: 0;
                margin-right: 31px;
            }
        }
    `]
    })
], WeekViewComponent);
export { WeekViewComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vla3ZpZXcuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9pb25pYzItY2FsZW5kYXIvIiwic291cmNlcyI6WyJ3ZWVrdmlldy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUV6QyxPQUFPLEVBQ0gsU0FBUyxFQUNULE1BQU0sRUFDTixTQUFTLEVBQ1QsV0FBVyxFQUNYLEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUNaLGFBQWEsRUFDYixTQUFTLEVBQ1QsaUJBQWlCLEVBQ2pCLFdBQVcsRUFDWCxVQUFVLEVBQ1YsU0FBUyxFQUFFLGFBQWEsRUFDM0IsTUFBTSxlQUFlLENBQUM7QUFnQnZCLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQXdkbkQsSUFBYSxpQkFBaUIseUJBQTlCLE1BQWEsaUJBQWlCO0lBRTFCLFlBQW9CLGVBQWdDLEVBQVUsR0FBZTtRQUF6RCxvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7UUFBVSxRQUFHLEdBQUgsR0FBRyxDQUFZO1FBSTlDLFVBQUssR0FBRyxJQUFJLENBQUM7UUFpQm5DLGVBQVUsR0FBRyxJQUFJLENBQUM7UUFJbEIsUUFBRyxHQUFHLEVBQUUsQ0FBQztRQUNULGlCQUFZLEdBQUcsQ0FBQyxDQUFDO1FBU2hCLG1CQUFjLEdBQUcsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUM1QyxvQkFBZSxHQUFHLElBQUksWUFBWSxFQUFVLENBQUM7UUFDN0MsbUJBQWMsR0FBRyxJQUFJLFlBQVksRUFBaUIsQ0FBQztRQUNuRCx3QkFBbUIsR0FBRyxJQUFJLFlBQVksRUFBaUIsQ0FBQztRQUN4RCxtQkFBYyxHQUFHLElBQUksWUFBWSxDQUFTLElBQUksQ0FBQyxDQUFDO1FBRW5ELFVBQUssR0FBZ0IsRUFBRSxDQUFDO1FBQ3hCLHFCQUFnQixHQUFHLENBQUMsQ0FBQztRQUVyQixjQUFTLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsU0FBSSxHQUFp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Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7S0E4UVQ7UUErTEQsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7aUJBOUw1Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0tBNkxSO0tBRUosQ0FBQztHQUNXLGlCQUFpQixDQTB3QjdCO1NBMXdCWSxpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0RhdGVQaXBlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtJb25TbGlkZXN9IGZyb20gJ0Bpb25pYy9hbmd1bGFyJztcbmltcG9ydCB7XG4gICAgQ29tcG9uZW50LFxuICAgIE9uSW5pdCxcbiAgICBPbkNoYW5nZXMsXG4gICAgSG9zdEJpbmRpbmcsXG4gICAgSW5wdXQsXG4gICAgT3V0cHV0LFxuICAgIEV2ZW50RW1pdHRlcixcbiAgICBTaW1wbGVDaGFuZ2VzLFxuICAgIFZpZXdDaGlsZCxcbiAgICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgICBUZW1wbGF0ZVJlZixcbiAgICBFbGVtZW50UmVmLFxuICAgIE9uRGVzdHJveSwgQWZ0ZXJWaWV3SW5pdFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7U3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHtcbiAgICBJQ2FsZW5kYXJDb21wb25lbnQsXG4gICAgSURpc3BsYXlFdmVudCxcbiAgICBJRXZlbnQsXG4gICAgSVRpbWVTZWxlY3RlZCxcbiAgICBJUmFuZ2UsXG4gICAgSVdlZWtWaWV3LFxuICAgIElXZWVrVmlld1JvdyxcbiAgICBJV2Vla1ZpZXdEYXRlUm93LFxuICAgIENhbGVuZGFyTW9kZSxcbiAgICBJRGF0ZUZvcm1hdHRlcixcbiAgICBJRGlzcGxheVdlZWtWaWV3SGVhZGVyXG59IGZyb20gJy4vY2FsZW5kYXInO1xuaW1wb3J0IHtDYWxlbmRhclNlcnZpY2V9IGZyb20gJy4vY2FsZW5kYXIuc2VydmljZSc7XG5pbXBvcnQge1xuICAgIElEaXNwbGF5QWxsRGF5RXZlbnQsXG4gICAgSVdlZWtWaWV3QWxsRGF5RXZlbnRTZWN0aW9uVGVtcGxhdGVDb250ZXh0LFxuICAgIElXZWVrVmlld05vcm1hbEV2ZW50U2VjdGlvblRlbXBsYXRlQ29udGV4dFxufSBmcm9tICcuL2NhbGVuZGFyJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICd3ZWVrdmlldycsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGlvbi1zbGlkZXMgI3dlZWtTbGlkZXIgW29wdGlvbnNdPVwic2xpZGVyT3B0aW9uc1wiIFtkaXJdPVwiZGlyXCIgKGlvblNsaWRlRGlkQ2hhbmdlKT1cIm9uU2xpZGVDaGFuZ2VkKClcIlxuICAgICAgICAgICAgICAgICAgICBjbGFzcz1cInNsaWRlcy1jb250YWluZXJcIj5cbiAgICAgICAgICAgIDxpb24tc2xpZGUgY2xhc3M9XCJzbGlkZS1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3M9XCJ0YWJsZSB0YWJsZS1ib3JkZXJlZCB0YWJsZS1maXhlZCB3ZWVrdmlldy1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGggY2xhc3M9XCJjYWxlbmRhci1ob3VyLWNvbHVtblwiPjwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGggY2xhc3M9XCJ3ZWVrdmlldy1oZWFkZXIgdGV4dC1jZW50ZXJcIiAqbmdGb3I9XCJsZXQgZGF0ZSBvZiB2aWV3c1swXS5kYXRlc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW25nQ2xhc3NdPVwiZ2V0SGlnaGxpZ2h0Q2xhc3MoZGF0ZSlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChjbGljayk9XCJkYXlTZWxlY3RlZChkYXRlKVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSBbbmdUZW1wbGF0ZU91dGxldF09XCJ3ZWVrdmlld0hlYWRlclRlbXBsYXRlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInt2aWV3RGF0ZTpkYXRlfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RoPlxuICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgICAgICAgPGRpdiAqbmdJZj1cIjA9PT1jdXJyZW50Vmlld0luZGV4XCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ3ZWVrdmlldy1hbGxkYXktdGFibGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ3ZWVrdmlldy1hbGxkYXktbGFiZWxcIj57e2FsbERheUxhYmVsfX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ3ZWVrdmlldy1hbGxkYXktY29udGVudC13cmFwcGVyIHNjcm9sbC1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzPVwidGFibGUgdGFibGUtZml4ZWQgd2Vla3ZpZXctYWxsZGF5LWNvbnRlbnQtdGFibGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgKm5nRm9yPVwibGV0IGRheSBvZiB2aWV3c1swXS5kYXRlc1wiIGNsYXNzPVwiY2FsZW5kYXItY2VsbFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSBbbmdUZW1wbGF0ZU91dGxldF09XCJ3ZWVrdmlld0FsbERheUV2ZW50U2VjdGlvblRlbXBsYXRlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cIntkYXk6ZGF5LCBldmVudFRlbXBsYXRlOndlZWt2aWV3QWxsRGF5RXZlbnRUZW1wbGF0ZX1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8aW5pdC1wb3NpdGlvbi1zY3JvbGwgY2xhc3M9XCJ3ZWVrdmlldy1ub3JtYWwtZXZlbnQtY29udGFpbmVyXCIgW2luaXRQb3NpdGlvbl09XCJpbml0U2Nyb2xsUG9zaXRpb25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW2VtaXRFdmVudF09XCJwcmVzZXJ2ZVNjcm9sbFBvc2l0aW9uXCIgKG9uU2Nyb2xsKT1cInNldFNjcm9sbFBvc2l0aW9uKCRldmVudClcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzcz1cInRhYmxlIHRhYmxlLWJvcmRlcmVkIHRhYmxlLWZpeGVkIHdlZWt2aWV3LW5vcm1hbC1ldmVudC10YWJsZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHIgKm5nRm9yPVwibGV0IHJvdyBvZiB2aWV3c1swXS5yb3dzOyBsZXQgaSA9IGluZGV4XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cImNhbGVuZGFyLWhvdXItY29sdW1uIHRleHQtY2VudGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7e2hvdXJDb2x1bW5MYWJlbHNbaV19fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgKm5nRm9yPVwibGV0IHRtIG9mIHJvd1wiIGNsYXNzPVwiY2FsZW5kYXItY2VsbFwiIHRhcHBhYmxlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoY2xpY2spPVwic2VsZWN0KHRtLnRpbWUsIHRtLmV2ZW50cylcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSBbbmdUZW1wbGF0ZU91dGxldF09XCJ3ZWVrdmlld05vcm1hbEV2ZW50U2VjdGlvblRlbXBsYXRlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwie3RtOnRtLCBob3VyUGFydHM6IGhvdXJQYXJ0cywgZXZlbnRUZW1wbGF0ZTp3ZWVrdmlld05vcm1hbEV2ZW50VGVtcGxhdGV9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgICAgICAgICAgIDwvaW5pdC1wb3NpdGlvbi1zY3JvbGw+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiAqbmdJZj1cIjAhPT1jdXJyZW50Vmlld0luZGV4XCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ3ZWVrdmlldy1hbGxkYXktdGFibGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ3ZWVrdmlldy1hbGxkYXktbGFiZWxcIj57e2FsbERheUxhYmVsfX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ3ZWVrdmlldy1hbGxkYXktY29udGVudC13cmFwcGVyIHNjcm9sbC1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzPVwidGFibGUgdGFibGUtZml4ZWQgd2Vla3ZpZXctYWxsZGF5LWNvbnRlbnQtdGFibGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgKm5nRm9yPVwibGV0IGRheSBvZiB2aWV3c1swXS5kYXRlc1wiIGNsYXNzPVwiY2FsZW5kYXItY2VsbFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSBbbmdUZW1wbGF0ZU91dGxldF09XCJ3ZWVrdmlld0luYWN0aXZlQWxsRGF5RXZlbnRTZWN0aW9uVGVtcGxhdGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwie2RheTpkYXl9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGluaXQtcG9zaXRpb24tc2Nyb2xsIGNsYXNzPVwid2Vla3ZpZXctbm9ybWFsLWV2ZW50LWNvbnRhaW5lclwiIFtpbml0UG9zaXRpb25dPVwiaW5pdFNjcm9sbFBvc2l0aW9uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3M9XCJ0YWJsZSB0YWJsZS1ib3JkZXJlZCB0YWJsZS1maXhlZCB3ZWVrdmlldy1ub3JtYWwtZXZlbnQtdGFibGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyICpuZ0Zvcj1cImxldCByb3cgb2Ygdmlld3NbMF0ucm93czsgbGV0IGkgPSBpbmRleFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjYWxlbmRhci1ob3VyLWNvbHVtbiB0ZXh0LWNlbnRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3tob3VyQ29sdW1uTGFiZWxzW2ldfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkICpuZ0Zvcj1cImxldCB0bSBvZiByb3dcIiBjbGFzcz1cImNhbGVuZGFyLWNlbGxcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSBbbmdUZW1wbGF0ZU91dGxldF09XCJ3ZWVrdmlld0luYWN0aXZlTm9ybWFsRXZlbnRTZWN0aW9uVGVtcGxhdGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7dG06dG0sIGhvdXJQYXJ0czogaG91clBhcnRzfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICAgICAgICAgICAgICA8L2luaXQtcG9zaXRpb24tc2Nyb2xsPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9pb24tc2xpZGU+XG4gICAgICAgICAgICA8aW9uLXNsaWRlIGNsYXNzPVwic2xpZGUtY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzPVwidGFibGUgdGFibGUtYm9yZGVyZWQgdGFibGUtZml4ZWQgd2Vla3ZpZXctaGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoIGNsYXNzPVwiY2FsZW5kYXItaG91ci1jb2x1bW5cIj48L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoIGNsYXNzPVwid2Vla3ZpZXctaGVhZGVyIHRleHQtY2VudGVyXCIgKm5nRm9yPVwibGV0IGRhdGUgb2Ygdmlld3NbMV0uZGF0ZXNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cImdldEhpZ2hsaWdodENsYXNzKGRhdGUpXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoY2xpY2spPVwiZGF5U2VsZWN0ZWQoZGF0ZSlcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwid2Vla3ZpZXdIZWFkZXJUZW1wbGF0ZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7dmlld0RhdGU6ZGF0ZX1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC90aD5cbiAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICAgICAgICAgIDxkaXYgKm5nSWY9XCIxPT09Y3VycmVudFZpZXdJbmRleFwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwid2Vla3ZpZXctYWxsZGF5LXRhYmxlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwid2Vla3ZpZXctYWxsZGF5LWxhYmVsXCI+e3thbGxEYXlMYWJlbH19PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwid2Vla3ZpZXctYWxsZGF5LWNvbnRlbnQtd3JhcHBlciBzY3JvbGwtY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzcz1cInRhYmxlIHRhYmxlLWZpeGVkIHdlZWt2aWV3LWFsbGRheS1jb250ZW50LXRhYmxlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkICpuZ0Zvcj1cImxldCBkYXkgb2Ygdmlld3NbMV0uZGF0ZXNcIiBjbGFzcz1cImNhbGVuZGFyLWNlbGxcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwid2Vla3ZpZXdBbGxEYXlFdmVudFNlY3Rpb25UZW1wbGF0ZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7ZGF5OmRheSwgZXZlbnRUZW1wbGF0ZTp3ZWVrdmlld0FsbERheUV2ZW50VGVtcGxhdGV9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGluaXQtcG9zaXRpb24tc2Nyb2xsIGNsYXNzPVwid2Vla3ZpZXctbm9ybWFsLWV2ZW50LWNvbnRhaW5lclwiIFtpbml0UG9zaXRpb25dPVwiaW5pdFNjcm9sbFBvc2l0aW9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtlbWl0RXZlbnRdPVwicHJlc2VydmVTY3JvbGxQb3NpdGlvblwiIChvblNjcm9sbCk9XCJzZXRTY3JvbGxQb3NpdGlvbigkZXZlbnQpXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3M9XCJ0YWJsZSB0YWJsZS1ib3JkZXJlZCB0YWJsZS1maXhlZCB3ZWVrdmlldy1ub3JtYWwtZXZlbnQtdGFibGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyICpuZ0Zvcj1cImxldCByb3cgb2Ygdmlld3NbMV0ucm93czsgbGV0IGkgPSBpbmRleFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjYWxlbmRhci1ob3VyLWNvbHVtbiB0ZXh0LWNlbnRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3tob3VyQ29sdW1uTGFiZWxzW2ldfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkICpuZ0Zvcj1cImxldCB0bSBvZiByb3dcIiBjbGFzcz1cImNhbGVuZGFyLWNlbGxcIiB0YXBwYWJsZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNsaWNrKT1cInNlbGVjdCh0bS50aW1lLCB0bS5ldmVudHMpXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IFtuZ0NsYXNzXT1cInsnY2FsZW5kYXItZXZlbnQtd3JhcCc6IHRtLmV2ZW50c31cIiAqbmdJZj1cInRtLmV2ZW50c1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSBbbmdUZW1wbGF0ZU91dGxldF09XCJ3ZWVrdmlld05vcm1hbEV2ZW50U2VjdGlvblRlbXBsYXRlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInt0bTp0bSwgaG91clBhcnRzOiBob3VyUGFydHMsIGV2ZW50VGVtcGxhdGU6d2Vla3ZpZXdOb3JtYWxFdmVudFRlbXBsYXRlfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICAgICAgICAgICAgICA8L2luaXQtcG9zaXRpb24tc2Nyb2xsPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgKm5nSWY9XCIxIT09Y3VycmVudFZpZXdJbmRleFwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwid2Vla3ZpZXctYWxsZGF5LXRhYmxlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwid2Vla3ZpZXctYWxsZGF5LWxhYmVsXCI+e3thbGxEYXlMYWJlbH19PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwid2Vla3ZpZXctYWxsZGF5LWNvbnRlbnQtd3JhcHBlciBzY3JvbGwtY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzcz1cInRhYmxlIHRhYmxlLWZpeGVkIHdlZWt2aWV3LWFsbGRheS1jb250ZW50LXRhYmxlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkICpuZ0Zvcj1cImxldCBkYXkgb2Ygdmlld3NbMV0uZGF0ZXNcIiBjbGFzcz1cImNhbGVuZGFyLWNlbGxcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwid2Vla3ZpZXdJbmFjdGl2ZUFsbERheUV2ZW50U2VjdGlvblRlbXBsYXRlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cIntkYXk6ZGF5fVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxpbml0LXBvc2l0aW9uLXNjcm9sbCBjbGFzcz1cIndlZWt2aWV3LW5vcm1hbC1ldmVudC1jb250YWluZXJcIiBbaW5pdFBvc2l0aW9uXT1cImluaXRTY3JvbGxQb3NpdGlvblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzPVwidGFibGUgdGFibGUtYm9yZGVyZWQgdGFibGUtZml4ZWQgd2Vla3ZpZXctbm9ybWFsLWV2ZW50LXRhYmxlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ciAqbmdGb3I9XCJsZXQgcm93IG9mIHZpZXdzWzFdLnJvd3M7IGxldCBpID0gaW5kZXhcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwiY2FsZW5kYXItaG91ci1jb2x1bW4gdGV4dC1jZW50ZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt7aG91ckNvbHVtbkxhYmVsc1tpXX19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCAqbmdGb3I9XCJsZXQgdG0gb2Ygcm93XCIgY2xhc3M9XCJjYWxlbmRhci1jZWxsXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IFtuZ0NsYXNzXT1cInsnY2FsZW5kYXItZXZlbnQtd3JhcCc6IHRtLmV2ZW50c31cIiAqbmdJZj1cInRtLmV2ZW50c1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSBbbmdUZW1wbGF0ZU91dGxldF09XCJ3ZWVrdmlld0luYWN0aXZlTm9ybWFsRXZlbnRTZWN0aW9uVGVtcGxhdGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwie3RtOnRtLCBob3VyUGFydHM6IGhvdXJQYXJ0c31cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgICAgICAgICAgPC9pbml0LXBvc2l0aW9uLXNjcm9sbD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvaW9uLXNsaWRlPlxuICAgICAgICAgICAgPGlvbi1zbGlkZSBjbGFzcz1cInNsaWRlLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzcz1cInRhYmxlIHRhYmxlLWJvcmRlcmVkIHRhYmxlLWZpeGVkIHdlZWt2aWV3LWhlYWRlclwiPlxuICAgICAgICAgICAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzcz1cImNhbGVuZGFyLWhvdXItY29sdW1uXCI+PC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzcz1cIndlZWt2aWV3LWhlYWRlciB0ZXh0LWNlbnRlclwiICpuZ0Zvcj1cImxldCBkYXRlIG9mIHZpZXdzWzJdLmRhdGVzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbbmdDbGFzc109XCJnZXRIaWdobGlnaHRDbGFzcyhkYXRlKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNsaWNrKT1cImRheVNlbGVjdGVkKGRhdGUpXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cIndlZWt2aWV3SGVhZGVyVGVtcGxhdGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwie3ZpZXdEYXRlOmRhdGV9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGg+XG4gICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgICAgICA8ZGl2ICpuZ0lmPVwiMj09PWN1cnJlbnRWaWV3SW5kZXhcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIndlZWt2aWV3LWFsbGRheS10YWJsZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIndlZWt2aWV3LWFsbGRheS1sYWJlbFwiPnt7YWxsRGF5TGFiZWx9fTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIndlZWt2aWV3LWFsbGRheS1jb250ZW50LXdyYXBwZXIgc2Nyb2xsLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3M9XCJ0YWJsZSB0YWJsZS1maXhlZCB3ZWVrdmlldy1hbGxkYXktY29udGVudC10YWJsZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCAqbmdGb3I9XCJsZXQgZGF5IG9mIHZpZXdzWzJdLmRhdGVzXCIgY2xhc3M9XCJjYWxlbmRhci1jZWxsXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cIndlZWt2aWV3QWxsRGF5RXZlbnRTZWN0aW9uVGVtcGxhdGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwie2RheTpkYXksIGV2ZW50VGVtcGxhdGU6d2Vla3ZpZXdBbGxEYXlFdmVudFRlbXBsYXRlfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxpbml0LXBvc2l0aW9uLXNjcm9sbCBjbGFzcz1cIndlZWt2aWV3LW5vcm1hbC1ldmVudC1jb250YWluZXJcIiBbaW5pdFBvc2l0aW9uXT1cImluaXRTY3JvbGxQb3NpdGlvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbZW1pdEV2ZW50XT1cInByZXNlcnZlU2Nyb2xsUG9zaXRpb25cIiAob25TY3JvbGwpPVwic2V0U2Nyb2xsUG9zaXRpb24oJGV2ZW50KVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzPVwidGFibGUgdGFibGUtYm9yZGVyZWQgdGFibGUtZml4ZWQgd2Vla3ZpZXctbm9ybWFsLWV2ZW50LXRhYmxlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ciAqbmdGb3I9XCJsZXQgcm93IG9mIHZpZXdzWzJdLnJvd3M7IGxldCBpID0gaW5kZXhcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwiY2FsZW5kYXItaG91ci1jb2x1bW4gdGV4dC1jZW50ZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt7aG91ckNvbHVtbkxhYmVsc1tpXX19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCAqbmdGb3I9XCJsZXQgdG0gb2Ygcm93XCIgY2xhc3M9XCJjYWxlbmRhci1jZWxsXCIgdGFwcGFibGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChjbGljayk9XCJzZWxlY3QodG0udGltZSwgdG0uZXZlbnRzKVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBbbmdDbGFzc109XCJ7J2NhbGVuZGFyLWV2ZW50LXdyYXAnOiB0bS5ldmVudHN9XCIgKm5nSWY9XCJ0bS5ldmVudHNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwid2Vla3ZpZXdOb3JtYWxFdmVudFNlY3Rpb25UZW1wbGF0ZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7dG06dG0sIGhvdXJQYXJ0czogaG91clBhcnRzLCBldmVudFRlbXBsYXRlOndlZWt2aWV3Tm9ybWFsRXZlbnRUZW1wbGF0ZX1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgICAgICAgICAgPC9pbml0LXBvc2l0aW9uLXNjcm9sbD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2ICpuZ0lmPVwiMiE9PWN1cnJlbnRWaWV3SW5kZXhcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIndlZWt2aWV3LWFsbGRheS10YWJsZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIndlZWt2aWV3LWFsbGRheS1sYWJlbFwiPnt7YWxsRGF5TGFiZWx9fTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIndlZWt2aWV3LWFsbGRheS1jb250ZW50LXdyYXBwZXIgc2Nyb2xsLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3M9XCJ0YWJsZSB0YWJsZS1maXhlZCB3ZWVrdmlldy1hbGxkYXktY29udGVudC10YWJsZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCAqbmdGb3I9XCJsZXQgZGF5IG9mIHZpZXdzWzJdLmRhdGVzXCIgY2xhc3M9XCJjYWxlbmRhci1jZWxsXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cIndlZWt2aWV3SW5hY3RpdmVBbGxEYXlFdmVudFNlY3Rpb25UZW1wbGF0ZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7ZGF5OmRheX1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8aW5pdC1wb3NpdGlvbi1zY3JvbGwgY2xhc3M9XCJ3ZWVrdmlldy1ub3JtYWwtZXZlbnQtY29udGFpbmVyXCIgW2luaXRQb3NpdGlvbl09XCJpbml0U2Nyb2xsUG9zaXRpb25cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzcz1cInRhYmxlIHRhYmxlLWJvcmRlcmVkIHRhYmxlLWZpeGVkIHdlZWt2aWV3LW5vcm1hbC1ldmVudC10YWJsZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHIgKm5nRm9yPVwibGV0IHJvdyBvZiB2aWV3c1syXS5yb3dzOyBsZXQgaSA9IGluZGV4XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cImNhbGVuZGFyLWhvdXItY29sdW1uIHRleHQtY2VudGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7e2hvdXJDb2x1bW5MYWJlbHNbaV19fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgKm5nRm9yPVwibGV0IHRtIG9mIHJvd1wiIGNsYXNzPVwiY2FsZW5kYXItY2VsbFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBbbmdDbGFzc109XCJ7J2NhbGVuZGFyLWV2ZW50LXdyYXAnOiB0bS5ldmVudHN9XCIgKm5nSWY9XCJ0bS5ldmVudHNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwid2Vla3ZpZXdJbmFjdGl2ZU5vcm1hbEV2ZW50U2VjdGlvblRlbXBsYXRlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInt0bTp0bSwgaG91clBhcnRzOiBob3VyUGFydHN9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgICAgICAgICAgIDwvaW5pdC1wb3NpdGlvbi1zY3JvbGw+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2lvbi1zbGlkZT5cbiAgICAgICAgPC9pb24tc2xpZGVzPlxuICAgIGAsXG4gICAgc3R5bGVzOiBbYFxuICAgICAgICAudGFibGUtZml4ZWQge1xuICAgICAgICAgICAgdGFibGUtbGF5b3V0OiBmaXhlZDtcbiAgICAgICAgfVxuXG4gICAgICAgIC50YWJsZSB7XG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgIG1heC13aWR0aDogMTAwJTtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgLnRhYmxlID4gdGhlYWQgPiB0ciA+IHRoLCAudGFibGUgPiB0Ym9keSA+IHRyID4gdGgsIC50YWJsZSA+IHRmb290ID4gdHIgPiB0aCwgLnRhYmxlID4gdGhlYWQgPiB0ciA+IHRkLFxuICAgICAgICAudGFibGUgPiB0Ym9keSA+IHRyID4gdGQsIC50YWJsZSA+IHRmb290ID4gdHIgPiB0ZCB7XG4gICAgICAgICAgICBwYWRkaW5nOiA4cHg7XG4gICAgICAgICAgICBsaW5lLWhlaWdodDogMjBweDtcbiAgICAgICAgICAgIHZlcnRpY2FsLWFsaWduOiB0b3A7XG4gICAgICAgIH1cblxuICAgICAgICAudGFibGUgPiB0aGVhZCA+IHRyID4gdGgge1xuICAgICAgICAgICAgdmVydGljYWwtYWxpZ246IGJvdHRvbTtcbiAgICAgICAgICAgIGJvcmRlci1ib3R0b206IDJweCBzb2xpZCAjZGRkO1xuICAgICAgICB9XG5cbiAgICAgICAgLnRhYmxlID4gdGhlYWQ6Zmlyc3QtY2hpbGQgPiB0cjpmaXJzdC1jaGlsZCA+IHRoLCAudGFibGUgPiB0aGVhZDpmaXJzdC1jaGlsZCA+IHRyOmZpcnN0LWNoaWxkID4gdGQge1xuICAgICAgICAgICAgYm9yZGVyLXRvcDogMFxuICAgICAgICB9XG5cbiAgICAgICAgLnRhYmxlID4gdGJvZHkgKyB0Ym9keSB7XG4gICAgICAgICAgICBib3JkZXItdG9wOiAycHggc29saWQgI2RkZDtcbiAgICAgICAgfVxuXG4gICAgICAgIC50YWJsZS1ib3JkZXJlZCB7XG4gICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAjZGRkO1xuICAgICAgICB9XG5cbiAgICAgICAgLnRhYmxlLWJvcmRlcmVkID4gdGhlYWQgPiB0ciA+IHRoLCAudGFibGUtYm9yZGVyZWQgPiB0Ym9keSA+IHRyID4gdGgsIC50YWJsZS1ib3JkZXJlZCA+IHRmb290ID4gdHIgPiB0aCxcbiAgICAgICAgLnRhYmxlLWJvcmRlcmVkID4gdGhlYWQgPiB0ciA+IHRkLCAudGFibGUtYm9yZGVyZWQgPiB0Ym9keSA+IHRyID4gdGQsIC50YWJsZS1ib3JkZXJlZCA+IHRmb290ID4gdHIgPiB0ZCB7XG4gICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAjZGRkO1xuICAgICAgICB9XG5cbiAgICAgICAgLnRhYmxlLWJvcmRlcmVkID4gdGhlYWQgPiB0ciA+IHRoLCAudGFibGUtYm9yZGVyZWQgPiB0aGVhZCA+IHRyID4gdGQge1xuICAgICAgICAgICAgYm9yZGVyLWJvdHRvbS13aWR0aDogMnB4O1xuICAgICAgICB9XG5cbiAgICAgICAgLnRhYmxlLXN0cmlwZWQgPiB0Ym9keSA+IHRyOm50aC1jaGlsZChvZGQpID4gdGQsIC50YWJsZS1zdHJpcGVkID4gdGJvZHkgPiB0cjpudGgtY2hpbGQob2RkKSA+IHRoIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmOWY5ZjlcbiAgICAgICAgfVxuXG4gICAgICAgIC5jYWxlbmRhci1ob3VyLWNvbHVtbiB7XG4gICAgICAgICAgICB3aWR0aDogNTBweDtcbiAgICAgICAgICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gICAgICAgIH1cblxuICAgICAgICAuY2FsZW5kYXItZXZlbnQtd3JhcCB7XG4gICAgICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgIGhlaWdodDogMTAwJTtcbiAgICAgICAgfVxuXG4gICAgICAgIC5jYWxlbmRhci1ldmVudCB7XG4gICAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgICAgICBwYWRkaW5nOiAycHg7XG4gICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgICAgICB6LWluZGV4OiAxMDAwMDtcbiAgICAgICAgfVxuXG4gICAgICAgIC5jYWxlbmRhci1jZWxsIHtcbiAgICAgICAgICAgIHBhZGRpbmc6IDAgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGhlaWdodDogMzdweDtcbiAgICAgICAgfVxuXG4gICAgICAgIC5zbGlkZXMtY29udGFpbmVyIHtcbiAgICAgICAgICAgIGhlaWdodDogMTAwJTtcbiAgICAgICAgfVxuXG4gICAgICAgIC5zbGlkZS1jb250YWluZXIge1xuICAgICAgICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICAgIH1cblxuICAgICAgICAud2Vla3ZpZXctYWxsZGF5LWxhYmVsIHtcbiAgICAgICAgICAgIGZsb2F0OiBsZWZ0O1xuICAgICAgICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgICAgICAgICAgbGluZS1oZWlnaHQ6IDUwcHg7XG4gICAgICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICAgICAgICB3aWR0aDogNTBweDtcbiAgICAgICAgICAgIGJvcmRlci1sZWZ0OiAxcHggc29saWQgI2RkZDtcbiAgICAgICAgfVxuXG4gICAgICAgIFtkaXI9XCJydGxcIl0gLndlZWt2aWV3LWFsbGRheS1sYWJlbCB7XG4gICAgICAgICAgICBmbG9hdDogcmlnaHQ7XG4gICAgICAgICAgICBib3JkZXItcmlnaHQ6IDFweCBzb2xpZCAjZGRkO1xuICAgICAgICB9XG5cbiAgICAgICAgLndlZWt2aWV3LWFsbGRheS1jb250ZW50LXdyYXBwZXIge1xuICAgICAgICAgICAgbWFyZ2luLWxlZnQ6IDUwcHg7XG4gICAgICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgICAgICAgICAgaGVpZ2h0OiA1MXB4O1xuICAgICAgICB9XG5cbiAgICAgICAgW2Rpcj1cInJ0bFwiXSAud2Vla3ZpZXctYWxsZGF5LWNvbnRlbnQtd3JhcHBlciB7XG4gICAgICAgICAgICBtYXJnaW4tbGVmdDogMDtcbiAgICAgICAgICAgIG1hcmdpbi1yaWdodDogNTBweDtcbiAgICAgICAgfVxuXG4gICAgICAgIC53ZWVrdmlldy1hbGxkYXktY29udGVudC10YWJsZSB7XG4gICAgICAgICAgICBtaW4taGVpZ2h0OiA1MHB4O1xuICAgICAgICB9XG5cbiAgICAgICAgLndlZWt2aWV3LWFsbGRheS1jb250ZW50LXRhYmxlIHRkIHtcbiAgICAgICAgICAgIGJvcmRlci1sZWZ0OiAxcHggc29saWQgI2RkZDtcbiAgICAgICAgICAgIGJvcmRlci1yaWdodDogMXB4IHNvbGlkICNkZGQ7XG4gICAgICAgIH1cblxuICAgICAgICAud2Vla3ZpZXctaGVhZGVyIHRoIHtcbiAgICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICAgICAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICAgICAgICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgICB9XG5cbiAgICAgICAgLndlZWt2aWV3LWFsbGRheS10YWJsZSB7XG4gICAgICAgICAgICBoZWlnaHQ6IDUwcHg7XG4gICAgICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2RkZDtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgICAgfVxuXG4gICAgICAgIC53ZWVrdmlldy1ub3JtYWwtZXZlbnQtY29udGFpbmVyIHtcbiAgICAgICAgICAgIG1hcmdpbi10b3A6IDg3cHg7XG4gICAgICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgICAgICAgICAgbGVmdDogMDtcbiAgICAgICAgICAgIHJpZ2h0OiAwO1xuICAgICAgICAgICAgdG9wOiAwO1xuICAgICAgICAgICAgYm90dG9tOiAwO1xuICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgICB9XG5cbiAgICAgICAgLnNjcm9sbC1jb250ZW50IHtcbiAgICAgICAgICAgIG92ZXJmbG93LXk6IGF1dG87XG4gICAgICAgICAgICBvdmVyZmxvdy14OiBoaWRkZW47XG4gICAgICAgIH1cblxuICAgICAgICA6Oi13ZWJraXQtc2Nyb2xsYmFyLFxuICAgICAgICAqOjotd2Via2l0LXNjcm9sbGJhciB7XG4gICAgICAgICAgICBkaXNwbGF5OiBub25lO1xuICAgICAgICB9XG5cbiAgICAgICAgLnRhYmxlID4gdGJvZHkgPiB0ciA+IHRkLmNhbGVuZGFyLWhvdXItY29sdW1uIHtcbiAgICAgICAgICAgIHBhZGRpbmctbGVmdDogMDtcbiAgICAgICAgICAgIHBhZGRpbmctcmlnaHQ6IDA7XG4gICAgICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuICAgICAgICB9XG5cbiAgICAgICAgQG1lZGlhIChtYXgtd2lkdGg6IDc1MHB4KSB7XG4gICAgICAgICAgICAud2Vla3ZpZXctYWxsZGF5LWxhYmVsLCAuY2FsZW5kYXItaG91ci1jb2x1bW4ge1xuICAgICAgICAgICAgICAgIHdpZHRoOiAzMXB4O1xuICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLndlZWt2aWV3LWFsbGRheS1sYWJlbCB7XG4gICAgICAgICAgICAgICAgcGFkZGluZy10b3A6IDRweDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLnRhYmxlID4gdGJvZHkgPiB0ciA+IHRkLmNhbGVuZGFyLWhvdXItY29sdW1uIHtcbiAgICAgICAgICAgICAgICBwYWRkaW5nLWxlZnQ6IDA7XG4gICAgICAgICAgICAgICAgcGFkZGluZy1yaWdodDogMDtcbiAgICAgICAgICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuICAgICAgICAgICAgICAgIGxpbmUtaGVpZ2h0OiAxMnB4O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAudGFibGUgPiB0aGVhZCA+IHRyID4gdGgud2Vla3ZpZXctaGVhZGVyIHtcbiAgICAgICAgICAgICAgICBwYWRkaW5nLWxlZnQ6IDA7XG4gICAgICAgICAgICAgICAgcGFkZGluZy1yaWdodDogMDtcbiAgICAgICAgICAgICAgICBmb250LXNpemU6IDEycHg7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC53ZWVrdmlldy1hbGxkYXktbGFiZWwge1xuICAgICAgICAgICAgICAgIGxpbmUtaGVpZ2h0OiAyMHB4O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAud2Vla3ZpZXctYWxsZGF5LWNvbnRlbnQtd3JhcHBlciB7XG4gICAgICAgICAgICAgICAgbWFyZ2luLWxlZnQ6IDMxcHg7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIFtkaXI9XCJydGxcIl0gLndlZWt2aWV3LWFsbGRheS1jb250ZW50LXdyYXBwZXIge1xuICAgICAgICAgICAgICAgIG1hcmdpbi1sZWZ0OiAwO1xuICAgICAgICAgICAgICAgIG1hcmdpbi1yaWdodDogMzFweDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIGBdLFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgV2Vla1ZpZXdDb21wb25lbnQgaW1wbGVtZW50cyBJQ2FsZW5kYXJDb21wb25lbnQsIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIEFmdGVyVmlld0luaXQge1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBjYWxlbmRhclNlcnZpY2U6IENhbGVuZGFyU2VydmljZSwgcHJpdmF0ZSBlbG06IEVsZW1lbnRSZWYpIHtcbiAgICB9XG5cbiAgICBAVmlld0NoaWxkKCd3ZWVrU2xpZGVyJywge3N0YXRpYzogdHJ1ZX0pIHNsaWRlcjogSW9uU2xpZGVzO1xuICAgIEBIb3N0QmluZGluZygnY2xhc3Mud2Vla3ZpZXcnKSBjbGFzcyA9IHRydWU7XG5cbiAgICBASW5wdXQoKSB3ZWVrdmlld0hlYWRlclRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxJRGlzcGxheVdlZWtWaWV3SGVhZGVyPjtcbiAgICBASW5wdXQoKSB3ZWVrdmlld0FsbERheUV2ZW50VGVtcGxhdGU6IFRlbXBsYXRlUmVmPElEaXNwbGF5QWxsRGF5RXZlbnQ+O1xuICAgIEBJbnB1dCgpIHdlZWt2aWV3Tm9ybWFsRXZlbnRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8SURpc3BsYXlFdmVudD47XG4gICAgQElucHV0KCkgd2Vla3ZpZXdBbGxEYXlFdmVudFNlY3Rpb25UZW1wbGF0ZTogVGVtcGxhdGVSZWY8SVdlZWtWaWV3QWxsRGF5RXZlbnRTZWN0aW9uVGVtcGxhdGVDb250ZXh0PjtcbiAgICBASW5wdXQoKSB3ZWVrdmlld05vcm1hbEV2ZW50U2VjdGlvblRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxJV2Vla1ZpZXdOb3JtYWxFdmVudFNlY3Rpb25UZW1wbGF0ZUNvbnRleHQ+O1xuICAgIEBJbnB1dCgpIHdlZWt2aWV3SW5hY3RpdmVBbGxEYXlFdmVudFNlY3Rpb25UZW1wbGF0ZTogVGVtcGxhdGVSZWY8SVdlZWtWaWV3QWxsRGF5RXZlbnRTZWN0aW9uVGVtcGxhdGVDb250ZXh0PjtcbiAgICBASW5wdXQoKSB3ZWVrdmlld0luYWN0aXZlTm9ybWFsRXZlbnRTZWN0aW9uVGVtcGxhdGU6IFRlbXBsYXRlUmVmPElXZWVrVmlld05vcm1hbEV2ZW50U2VjdGlvblRlbXBsYXRlQ29udGV4dD47XG5cbiAgICBASW5wdXQoKSBmb3JtYXRXZWVrVGl0bGU6IHN0cmluZztcbiAgICBASW5wdXQoKSBmb3JtYXRXZWVrVmlld0RheUhlYWRlcjogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGZvcm1hdEhvdXJDb2x1bW46IHN0cmluZztcbiAgICBASW5wdXQoKSBzdGFydGluZ0RheVdlZWs6IG51bWJlcjtcbiAgICBASW5wdXQoKSBhbGxEYXlMYWJlbDogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGhvdXJQYXJ0czogbnVtYmVyO1xuICAgIEBJbnB1dCgpIGV2ZW50U291cmNlOiBJRXZlbnRbXTtcbiAgICBASW5wdXQoKSBhdXRvU2VsZWN0ID0gdHJ1ZTtcbiAgICBASW5wdXQoKSBtYXJrRGlzYWJsZWQ6IChkYXRlOiBEYXRlKSA9PiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGxvY2FsZTogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGRhdGVGb3JtYXR0ZXI6IElEYXRlRm9ybWF0dGVyO1xuICAgIEBJbnB1dCgpIGRpciA9ICcnO1xuICAgIEBJbnB1dCgpIHNjcm9sbFRvSG91ciA9IDA7XG4gICAgQElucHV0KCkgcHJlc2VydmVTY3JvbGxQb3NpdGlvbjogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBsb2NrU3dpcGVUb1ByZXY6IGJvb2xlYW47XG4gICAgQElucHV0KCkgbG9ja1N3aXBlczogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBzdGFydEhvdXI6IG51bWJlcjtcbiAgICBASW5wdXQoKSBlbmRIb3VyOiBudW1iZXI7XG4gICAgQElucHV0KCkgc2xpZGVyT3B0aW9uczogYW55O1xuICAgIEBJbnB1dCgpIGhvdXJTZWdtZW50czogbnVtYmVyO1xuXG4gICAgQE91dHB1dCgpIG9uUmFuZ2VDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxJUmFuZ2U+KCk7XG4gICAgQE91dHB1dCgpIG9uRXZlbnRTZWxlY3RlZCA9IG5ldyBFdmVudEVtaXR0ZXI8SUV2ZW50PigpO1xuICAgIEBPdXRwdXQoKSBvblRpbWVTZWxlY3RlZCA9IG5ldyBFdmVudEVtaXR0ZXI8SVRpbWVTZWxlY3RlZD4oKTtcbiAgICBAT3V0cHV0KCkgb25EYXlIZWFkZXJTZWxlY3RlZCA9IG5ldyBFdmVudEVtaXR0ZXI8SVRpbWVTZWxlY3RlZD4oKTtcbiAgICBAT3V0cHV0KCkgb25UaXRsZUNoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4odHJ1ZSk7XG5cbiAgICBwdWJsaWMgdmlld3M6IElXZWVrVmlld1tdID0gW107XG4gICAgcHVibGljIGN1cnJlbnRWaWV3SW5kZXggPSAwO1xuICAgIHB1YmxpYyByYW5nZTogSVJhbmdlO1xuICAgIHB1YmxpYyBkaXJlY3Rpb24gPSAwO1xuICAgIHB1YmxpYyBtb2RlOiBDYWxlbmRhck1vZGUgPSAnd2Vlayc7XG5cbiAgICBwcml2YXRlIGluaXRlZCA9IGZhbHNlO1xuICAgIHByaXZhdGUgY2FsbGJhY2tPbkluaXQgPSB0cnVlO1xuICAgIHByaXZhdGUgY3VycmVudERhdGVDaGFuZ2VkRnJvbVBhcmVudFN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICAgIHByaXZhdGUgZXZlbnRTb3VyY2VDaGFuZ2VkU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gICAgcHJpdmF0ZSBzbGlkZUNoYW5nZWRTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgICBwcml2YXRlIHNsaWRlVXBkYXRlZFN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gICAgcHVibGljIGhvdXJDb2x1bW5MYWJlbHM6IHN0cmluZ1tdO1xuICAgIHB1YmxpYyBpbml0U2Nyb2xsUG9zaXRpb246IG51bWJlcjtcbiAgICBwcml2YXRlIGZvcm1hdERheUhlYWRlcjogKGRhdGU6IERhdGUpID0+IHN0cmluZztcbiAgICBwcml2YXRlIGZvcm1hdFRpdGxlOiAoZGF0ZTogRGF0ZSkgPT4gc3RyaW5nO1xuICAgIHByaXZhdGUgZm9ybWF0SG91ckNvbHVtbkxhYmVsOiAoZGF0ZTogRGF0ZSkgPT4gc3RyaW5nO1xuICAgIHByaXZhdGUgaG91clJhbmdlOiBudW1iZXI7XG5cbiAgICBzdGF0aWMgY3JlYXRlRGF0ZU9iamVjdHMoc3RhcnRUaW1lOiBEYXRlLCBzdGFydEhvdXI6IG51bWJlciwgZW5kSG91cjogbnVtYmVyLCB0aW1lSW50ZXJ2YWw6IG51bWJlcik6IElXZWVrVmlld1Jvd1tdW10ge1xuICAgICAgICBjb25zdCB0aW1lczogSVdlZWtWaWV3Um93W11bXSA9IFtdLFxuICAgICAgICAgICAgY3VycmVudEhvdXIgPSAwLFxuICAgICAgICAgICAgY3VycmVudERhdGUgPSBzdGFydFRpbWUuZ2V0RGF0ZSgpO1xuICAgICAgICBsZXQgaG91clN0ZXAsXG4gICAgICAgICAgICBtaW5TdGVwO1xuXG4gICAgICAgIGlmICh0aW1lSW50ZXJ2YWwgPCAxKSB7XG4gICAgICAgICAgICBob3VyU3RlcCA9IE1hdGguZmxvb3IoMSAvIHRpbWVJbnRlcnZhbCk7XG4gICAgICAgICAgICBtaW5TdGVwID0gNjA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBob3VyU3RlcCA9IDE7XG4gICAgICAgICAgICBtaW5TdGVwID0gTWF0aC5mbG9vcig2MCAvIHRpbWVJbnRlcnZhbCk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBob3VyID0gc3RhcnRIb3VyOyBob3VyIDwgZW5kSG91cjsgaG91ciArPSBob3VyU3RlcCkge1xuICAgICAgICAgICAgZm9yIChsZXQgaW50ZXJ2YWwgPSAwOyBpbnRlcnZhbCA8IDYwOyBpbnRlcnZhbCArPSBtaW5TdGVwKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgcm93OiBJV2Vla1ZpZXdSb3dbXSA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGRheSA9IDA7IGRheSA8IDc7IGRheSArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRpbWUgPSBuZXcgRGF0ZShzdGFydFRpbWUuZ2V0VGltZSgpKTtcbiAgICAgICAgICAgICAgICAgICAgdGltZS5zZXRIb3VycyhjdXJyZW50SG91ciArIGhvdXIsIGludGVydmFsKTtcbiAgICAgICAgICAgICAgICAgICAgdGltZS5zZXREYXRlKGN1cnJlbnREYXRlICsgZGF5KTtcbiAgICAgICAgICAgICAgICAgICAgcm93LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRpbWVzLnB1c2gocm93KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGltZXM7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldERhdGVzKHN0YXJ0VGltZTogRGF0ZSwgbjogbnVtYmVyKTogSVdlZWtWaWV3RGF0ZVJvd1tdIHtcbiAgICAgICAgY29uc3QgZGF0ZXMgPSBuZXcgQXJyYXkobiksXG4gICAgICAgICAgICBjdXJyZW50ID0gbmV3IERhdGUoc3RhcnRUaW1lLmdldFRpbWUoKSk7XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPCBuKSB7XG4gICAgICAgICAgICBkYXRlc1tpKytdID0ge1xuICAgICAgICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKGN1cnJlbnQuZ2V0VGltZSgpKSxcbiAgICAgICAgICAgICAgICBldmVudHM6IFtdLFxuICAgICAgICAgICAgICAgIGRheUhlYWRlcjogJydcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjdXJyZW50LnNldERhdGUoY3VycmVudC5nZXREYXRlKCkgKyAxKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGF0ZXM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgY29tcGFyZUV2ZW50QnlTdGFydE9mZnNldChldmVudEE6IElEaXNwbGF5RXZlbnQsIGV2ZW50QjogSURpc3BsYXlFdmVudCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBldmVudEEuc3RhcnRPZmZzZXQgLSBldmVudEIuc3RhcnRPZmZzZXQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgY2FsY3VsYXRlV2lkdGgob3JkZXJlZEV2ZW50czogSURpc3BsYXlFdmVudFtdLCBzaXplOiBudW1iZXIsIGhvdXJQYXJ0czogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IHRvdGFsU2l6ZSA9IHNpemUgKiBob3VyUGFydHMsXG4gICAgICAgICAgICBjZWxscyA9IG5ldyBBcnJheSh0b3RhbFNpemUpO1xuXG4gICAgICAgIC8vIHNvcnQgYnkgcG9zaXRpb24gaW4gZGVzY2VuZGluZyBvcmRlciwgdGhlIHJpZ2h0IG1vc3QgY29sdW1ucyBzaG91bGQgYmUgY2FsY3VsYXRlZCBmaXJzdFxuICAgICAgICBvcmRlcmVkRXZlbnRzLnNvcnQoKGV2ZW50QSwgZXZlbnRCKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZXZlbnRCLnBvc2l0aW9uIC0gZXZlbnRBLnBvc2l0aW9uO1xuICAgICAgICB9KTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b3RhbFNpemU7IGkgKz0gMSkge1xuICAgICAgICAgICAgY2VsbHNbaV0gPSB7XG4gICAgICAgICAgICAgICAgY2FsY3VsYXRlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgZXZlbnRzOiBbXVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBsZW4gPSBvcmRlcmVkRXZlbnRzLmxlbmd0aDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgICAgICAgY29uc3QgZXZlbnQgPSBvcmRlcmVkRXZlbnRzW2ldO1xuICAgICAgICAgICAgbGV0IGluZGV4ID0gZXZlbnQuc3RhcnRJbmRleCAqIGhvdXJQYXJ0cyArIGV2ZW50LnN0YXJ0T2Zmc2V0O1xuICAgICAgICAgICAgd2hpbGUgKGluZGV4IDwgZXZlbnQuZW5kSW5kZXggKiBob3VyUGFydHMgLSBldmVudC5lbmRPZmZzZXQpIHtcbiAgICAgICAgICAgICAgICBjZWxsc1tpbmRleF0uZXZlbnRzLnB1c2goZXZlbnQpO1xuICAgICAgICAgICAgICAgIGluZGV4ICs9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIHdoaWxlIChpIDwgbGVuKSB7XG4gICAgICAgICAgICBsZXQgZXZlbnQgPSBvcmRlcmVkRXZlbnRzW2ldO1xuICAgICAgICAgICAgaWYgKCFldmVudC5vdmVybGFwTnVtYmVyKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3ZlcmxhcE51bWJlciA9IGV2ZW50LnBvc2l0aW9uICsgMTtcbiAgICAgICAgICAgICAgICBldmVudC5vdmVybGFwTnVtYmVyID0gb3ZlcmxhcE51bWJlcjtcbiAgICAgICAgICAgICAgICBjb25zdCBldmVudFF1ZXVlID0gW2V2ZW50XTtcbiAgICAgICAgICAgICAgICB3aGlsZSAoZXZlbnQgPSBldmVudFF1ZXVlLnNoaWZ0KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gZXZlbnQuc3RhcnRJbmRleCAqIGhvdXJQYXJ0cyArIGV2ZW50LnN0YXJ0T2Zmc2V0O1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoaW5kZXggPCBldmVudC5lbmRJbmRleCAqIGhvdXJQYXJ0cyAtIGV2ZW50LmVuZE9mZnNldCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFjZWxsc1tpbmRleF0uY2FsY3VsYXRlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGxzW2luZGV4XS5jYWxjdWxhdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2VsbHNbaW5kZXhdLmV2ZW50cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBldmVudENvdW50SW5DZWxsID0gY2VsbHNbaW5kZXhdLmV2ZW50cy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZXZlbnRDb3VudEluQ2VsbDsgaiArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50RXZlbnRJbkNlbGwgPSBjZWxsc1tpbmRleF0uZXZlbnRzW2pdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFjdXJyZW50RXZlbnRJbkNlbGwub3ZlcmxhcE51bWJlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRFdmVudEluQ2VsbC5vdmVybGFwTnVtYmVyID0gb3ZlcmxhcE51bWJlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudFF1ZXVlLnB1c2goY3VycmVudEV2ZW50SW5DZWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ICs9IDE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpICs9IDE7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLnNsaWRlck9wdGlvbnMpIHtcbiAgICAgICAgICAgIHRoaXMuc2xpZGVyT3B0aW9ucyA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2xpZGVyT3B0aW9ucy5sb29wID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLmhvdXJSYW5nZSA9ICh0aGlzLmVuZEhvdXIgLSB0aGlzLnN0YXJ0SG91cikgKiB0aGlzLmhvdXJTZWdtZW50cztcbiAgICAgICAgaWYgKHRoaXMuZGF0ZUZvcm1hdHRlciAmJiB0aGlzLmRhdGVGb3JtYXR0ZXIuZm9ybWF0V2Vla1ZpZXdEYXlIZWFkZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZm9ybWF0RGF5SGVhZGVyID0gdGhpcy5kYXRlRm9ybWF0dGVyLmZvcm1hdFdlZWtWaWV3RGF5SGVhZGVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZGF0ZVBpcGUgPSBuZXcgRGF0ZVBpcGUodGhpcy5sb2NhbGUpO1xuICAgICAgICAgICAgdGhpcy5mb3JtYXREYXlIZWFkZXIgPSBmdW5jdGlvbiAoZGF0ZTogRGF0ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYXRlUGlwZS50cmFuc2Zvcm0oZGF0ZSwgdGhpcy5mb3JtYXRXZWVrVmlld0RheUhlYWRlcik7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZGF0ZUZvcm1hdHRlciAmJiB0aGlzLmRhdGVGb3JtYXR0ZXIuZm9ybWF0V2Vla1ZpZXdUaXRsZSkge1xuICAgICAgICAgICAgdGhpcy5mb3JtYXRUaXRsZSA9IHRoaXMuZGF0ZUZvcm1hdHRlci5mb3JtYXRXZWVrVmlld1RpdGxlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZGF0ZVBpcGUgPSBuZXcgRGF0ZVBpcGUodGhpcy5sb2NhbGUpO1xuICAgICAgICAgICAgdGhpcy5mb3JtYXRUaXRsZSA9IGZ1bmN0aW9uIChkYXRlOiBEYXRlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGVQaXBlLnRyYW5zZm9ybShkYXRlLCB0aGlzLmZvcm1hdFdlZWtUaXRsZSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZGF0ZUZvcm1hdHRlciAmJiB0aGlzLmRhdGVGb3JtYXR0ZXIuZm9ybWF0V2Vla1ZpZXdIb3VyQ29sdW1uKSB7XG4gICAgICAgICAgICB0aGlzLmZvcm1hdEhvdXJDb2x1bW5MYWJlbCA9IHRoaXMuZGF0ZUZvcm1hdHRlci5mb3JtYXRXZWVrVmlld0hvdXJDb2x1bW47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBkYXRlUGlwZSA9IG5ldyBEYXRlUGlwZSh0aGlzLmxvY2FsZSk7XG4gICAgICAgICAgICB0aGlzLmZvcm1hdEhvdXJDb2x1bW5MYWJlbCA9IGZ1bmN0aW9uIChkYXRlOiBEYXRlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGVQaXBlLnRyYW5zZm9ybShkYXRlLCB0aGlzLmZvcm1hdEhvdXJDb2x1bW4pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmxvY2tTd2lwZVRvUHJldikge1xuICAgICAgICAgICAgdGhpcy5zbGlkZXIubG9ja1N3aXBlVG9QcmV2KHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMubG9ja1N3aXBlcykge1xuICAgICAgICAgICAgdGhpcy5zbGlkZXIubG9ja1N3aXBlcyh0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmVmcmVzaFZpZXcoKTtcbiAgICAgICAgdGhpcy5ob3VyQ29sdW1uTGFiZWxzID0gdGhpcy5nZXRIb3VyQ29sdW1uTGFiZWxzKCk7XG4gICAgICAgIHRoaXMuaW5pdGVkID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLmN1cnJlbnREYXRlQ2hhbmdlZEZyb21QYXJlbnRTdWJzY3JpcHRpb24gPSB0aGlzLmNhbGVuZGFyU2VydmljZS5jdXJyZW50RGF0ZUNoYW5nZWRGcm9tUGFyZW50JC5zdWJzY3JpYmUoY3VycmVudERhdGUgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZWZyZXNoVmlldygpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmV2ZW50U291cmNlQ2hhbmdlZFN1YnNjcmlwdGlvbiA9IHRoaXMuY2FsZW5kYXJTZXJ2aWNlLmV2ZW50U291cmNlQ2hhbmdlZCQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMub25EYXRhTG9hZGVkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc2xpZGVDaGFuZ2VkU3Vic2NyaXB0aW9uID0gdGhpcy5jYWxlbmRhclNlcnZpY2Uuc2xpZGVDaGFuZ2VkJC5zdWJzY3JpYmUoZGlyZWN0aW9uID0+IHtcbiAgICAgICAgICAgIGlmIChkaXJlY3Rpb24gPT09IDEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNsaWRlci5zbGlkZU5leHQoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAtMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVyLnNsaWRlUHJldigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnNsaWRlVXBkYXRlZFN1YnNjcmlwdGlvbiA9IHRoaXMuY2FsZW5kYXJTZXJ2aWNlLnNsaWRlVXBkYXRlZCQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2xpZGVyLnVwZGF0ZSgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgICAgIGNvbnN0IHRpdGxlID0gdGhpcy5nZXRUaXRsZSgpO1xuICAgICAgICB0aGlzLm9uVGl0bGVDaGFuZ2VkLmVtaXQodGl0bGUpO1xuXG4gICAgICAgIGlmICh0aGlzLnNjcm9sbFRvSG91ciA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGhvdXJDb2x1bW5zID0gdGhpcy5lbG0ubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcud2Vla3ZpZXctbm9ybWFsLWV2ZW50LWNvbnRhaW5lcicpLnF1ZXJ5U2VsZWN0b3JBbGwoJy5jYWxlbmRhci1ob3VyLWNvbHVtbicpO1xuICAgICAgICAgICAgY29uc3QgbWUgPSB0aGlzO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgbWUuaW5pdFNjcm9sbFBvc2l0aW9uID0gaG91ckNvbHVtbnNbbWUuc2Nyb2xsVG9Ib3VyIC0gbWUuc3RhcnRIb3VyXS5vZmZzZXRUb3A7XG4gICAgICAgICAgICB9LCA1MCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgICAgIGlmICghdGhpcy5pbml0ZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgoY2hhbmdlcy5zdGFydEhvdXIgfHwgY2hhbmdlcy5lbmRIb3VyKSAmJiAoIWNoYW5nZXMuc3RhcnRIb3VyLmlzRmlyc3RDaGFuZ2UoKSB8fCAhY2hhbmdlcy5lbmRIb3VyLmlzRmlyc3RDaGFuZ2UoKSkpIHtcbiAgICAgICAgICAgIHRoaXMudmlld3MgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB0aGlzLmhvdXJSYW5nZSA9ICh0aGlzLmVuZEhvdXIgLSB0aGlzLnN0YXJ0SG91cikgKiB0aGlzLmhvdXJTZWdtZW50cztcbiAgICAgICAgICAgIHRoaXMuZGlyZWN0aW9uID0gMDtcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaFZpZXcoKTtcbiAgICAgICAgICAgIHRoaXMuaG91ckNvbHVtbkxhYmVscyA9IHRoaXMuZ2V0SG91ckNvbHVtbkxhYmVscygpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZXZlbnRTb3VyY2VDaGFuZ2UgPSBjaGFuZ2VzLmV2ZW50U291cmNlO1xuICAgICAgICBpZiAoZXZlbnRTb3VyY2VDaGFuZ2UgJiYgZXZlbnRTb3VyY2VDaGFuZ2UuY3VycmVudFZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLm9uRGF0YUxvYWRlZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbG9ja1N3aXBlVG9QcmV2ID0gY2hhbmdlcy5sb2NrU3dpcGVUb1ByZXY7XG4gICAgICAgIGlmIChsb2NrU3dpcGVUb1ByZXYpIHtcbiAgICAgICAgICAgIHRoaXMuc2xpZGVyLmxvY2tTd2lwZVRvUHJldihsb2NrU3dpcGVUb1ByZXYuY3VycmVudFZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGxvY2tTd2lwZXMgPSBjaGFuZ2VzLmxvY2tTd2lwZXM7XG4gICAgICAgIGlmIChsb2NrU3dpcGVzKSB7XG4gICAgICAgICAgICB0aGlzLnNsaWRlci5sb2NrU3dpcGVzKGxvY2tTd2lwZXMuY3VycmVudFZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50RGF0ZUNoYW5nZWRGcm9tUGFyZW50U3Vic2NyaXB0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnREYXRlQ2hhbmdlZEZyb21QYXJlbnRTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudERhdGVDaGFuZ2VkRnJvbVBhcmVudFN1YnNjcmlwdGlvbiA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5ldmVudFNvdXJjZUNoYW5nZWRTdWJzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRTb3VyY2VDaGFuZ2VkU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICB0aGlzLmV2ZW50U291cmNlQ2hhbmdlZFN1YnNjcmlwdGlvbiA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5zbGlkZUNoYW5nZWRTdWJzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuc2xpZGVDaGFuZ2VkU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICB0aGlzLnNsaWRlQ2hhbmdlZFN1YnNjcmlwdGlvbiA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5zbGlkZVVwZGF0ZWRTdWJzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuc2xpZGVVcGRhdGVkU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICB0aGlzLnNsaWRlVXBkYXRlZFN1YnNjcmlwdGlvbiA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvblNsaWRlQ2hhbmdlZCgpIHtcbiAgICAgICAgaWYgKHRoaXMuY2FsbGJhY2tPbkluaXQpIHtcbiAgICAgICAgICAgIHRoaXMuY2FsbGJhY2tPbkluaXQgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGN1cnJlbnRWaWV3SW5kZXggPSB0aGlzLmN1cnJlbnRWaWV3SW5kZXg7XG4gICAgICAgIGxldCBkaXJlY3Rpb24gPSAwO1xuXG4gICAgICAgIHRoaXMuc2xpZGVyLmdldEFjdGl2ZUluZGV4KCkudGhlbihjdXJyZW50U2xpZGVJbmRleCA9PiB7XG4gICAgICAgICAgICBjdXJyZW50U2xpZGVJbmRleCA9IChjdXJyZW50U2xpZGVJbmRleCArIDIpICUgMztcbiAgICAgICAgICAgIGlmKGlzTmFOKGN1cnJlbnRTbGlkZUluZGV4KSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRTbGlkZUluZGV4ID0gY3VycmVudFZpZXdJbmRleDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGN1cnJlbnRTbGlkZUluZGV4IC0gY3VycmVudFZpZXdJbmRleCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIGRpcmVjdGlvbiA9IDE7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGN1cnJlbnRTbGlkZUluZGV4ID09PSAwICYmIGN1cnJlbnRWaWV3SW5kZXggPT09IDIpIHtcbiAgICAgICAgICAgICAgICBkaXJlY3Rpb24gPSAxO1xuICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVyLnNsaWRlVG8oMSwgMCwgZmFsc2UpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjdXJyZW50Vmlld0luZGV4IC0gY3VycmVudFNsaWRlSW5kZXggPT09IDEpIHtcbiAgICAgICAgICAgICAgICBkaXJlY3Rpb24gPSAtMTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VycmVudFNsaWRlSW5kZXggPT09IDIgJiYgY3VycmVudFZpZXdJbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGRpcmVjdGlvbiA9IC0xO1xuICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVyLnNsaWRlVG8oMywgMCwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jdXJyZW50Vmlld0luZGV4ID0gY3VycmVudFNsaWRlSW5kZXg7XG4gICAgICAgICAgICB0aGlzLm1vdmUoZGlyZWN0aW9uKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbW92ZShkaXJlY3Rpb246IG51bWJlcikge1xuICAgICAgICBpZiAoZGlyZWN0aW9uID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XG4gICAgICAgIGNvbnN0IGFkamFjZW50ID0gdGhpcy5jYWxlbmRhclNlcnZpY2UuZ2V0QWRqYWNlbnRDYWxlbmRhckRhdGUodGhpcy5tb2RlLCBkaXJlY3Rpb24pO1xuICAgICAgICB0aGlzLmNhbGVuZGFyU2VydmljZS5zZXRDdXJyZW50RGF0ZShhZGphY2VudCk7XG4gICAgICAgIHRoaXMucmVmcmVzaFZpZXcoKTtcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSAwO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0SG91ckNvbHVtbkxhYmVscygpOiBzdHJpbmdbXSB7XG4gICAgICAgIGNvbnN0IGhvdXJDb2x1bW5MYWJlbHM6IHN0cmluZ1tdID0gW107XG4gICAgICAgIGZvciAobGV0IGhvdXIgPSAwLCBsZW5ndGggPSB0aGlzLnZpZXdzWzBdLnJvd3MubGVuZ3RoOyBob3VyIDwgbGVuZ3RoOyBob3VyICs9IDEpIHtcbiAgICAgICAgICAgIC8vIGhhbmRsZSBlZGdlIGNhc2UgZm9yIERTVFxuICAgICAgICAgICAgaWYgKGhvdXIgPT09IDAgJiYgdGhpcy52aWV3c1swXS5yb3dzW2hvdXJdWzBdLnRpbWUuZ2V0SG91cnMoKSAhPT0gdGhpcy5zdGFydEhvdXIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0aW1lID0gbmV3IERhdGUodGhpcy52aWV3c1swXS5yb3dzW2hvdXJdWzBdLnRpbWUpO1xuICAgICAgICAgICAgICAgIHRpbWUuc2V0RGF0ZSh0aW1lLmdldERhdGUoKSArIDEpO1xuICAgICAgICAgICAgICAgIHRpbWUuc2V0SG91cnModGhpcy5zdGFydEhvdXIpO1xuICAgICAgICAgICAgICAgIGhvdXJDb2x1bW5MYWJlbHMucHVzaCh0aGlzLmZvcm1hdEhvdXJDb2x1bW5MYWJlbCh0aW1lKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGhvdXJDb2x1bW5MYWJlbHMucHVzaCh0aGlzLmZvcm1hdEhvdXJDb2x1bW5MYWJlbCh0aGlzLnZpZXdzWzBdLnJvd3NbaG91cl1bMF0udGltZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBob3VyQ29sdW1uTGFiZWxzO1xuICAgIH1cblxuICAgIGdldFZpZXdEYXRhKHN0YXJ0VGltZTogRGF0ZSk6IElXZWVrVmlldyB7XG4gICAgICAgIGNvbnN0IGRhdGVzID0gV2Vla1ZpZXdDb21wb25lbnQuZ2V0RGF0ZXMoc3RhcnRUaW1lLCA3KTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA3OyBpKyspIHtcbiAgICAgICAgICAgIGRhdGVzW2ldLmRheUhlYWRlciA9IHRoaXMuZm9ybWF0RGF5SGVhZGVyKGRhdGVzW2ldLmRhdGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJvd3M6IFdlZWtWaWV3Q29tcG9uZW50LmNyZWF0ZURhdGVPYmplY3RzKHN0YXJ0VGltZSwgdGhpcy5zdGFydEhvdXIsIHRoaXMuZW5kSG91ciwgdGhpcy5ob3VyU2VnbWVudHMpLFxuICAgICAgICAgICAgZGF0ZXNcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBnZXRSYW5nZShjdXJyZW50RGF0ZTogRGF0ZSk6IElSYW5nZSB7XG4gICAgICAgIGNvbnN0IHllYXIgPSBjdXJyZW50RGF0ZS5nZXRGdWxsWWVhcigpLFxuICAgICAgICAgICAgbW9udGggPSBjdXJyZW50RGF0ZS5nZXRNb250aCgpLFxuICAgICAgICAgICAgZGF0ZSA9IGN1cnJlbnREYXRlLmdldERhdGUoKSxcbiAgICAgICAgICAgIGRheSA9IGN1cnJlbnREYXRlLmdldERheSgpO1xuICAgICAgICBsZXQgZGlmZmVyZW5jZSA9IGRheSAtIHRoaXMuc3RhcnRpbmdEYXlXZWVrO1xuXG4gICAgICAgIGlmIChkaWZmZXJlbmNlIDwgMCkge1xuICAgICAgICAgICAgZGlmZmVyZW5jZSArPSA3O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gc2V0IGhvdXIgdG8gMTIgdG8gYXZvaWQgRFNUIHByb2JsZW1cbiAgICAgICAgY29uc3QgZmlyc3REYXlPZldlZWsgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgZGF0ZSAtIGRpZmZlcmVuY2UsIDEyLCAwLCAwKSxcbiAgICAgICAgICAgIGVuZFRpbWUgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgZGF0ZSAtIGRpZmZlcmVuY2UgKyA3LCAxMiwgMCwgMCk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXJ0VGltZTogZmlyc3REYXlPZldlZWssXG4gICAgICAgICAgICBlbmRUaW1lXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgb25EYXRhTG9hZGVkKCkge1xuICAgICAgICBjb25zdCBldmVudFNvdXJjZSA9IHRoaXMuZXZlbnRTb3VyY2UsXG4gICAgICAgICAgICBsZW4gPSBldmVudFNvdXJjZSA/IGV2ZW50U291cmNlLmxlbmd0aCA6IDAsXG4gICAgICAgICAgICBzdGFydFRpbWUgPSB0aGlzLnJhbmdlLnN0YXJ0VGltZSxcbiAgICAgICAgICAgIGVuZFRpbWUgPSB0aGlzLnJhbmdlLmVuZFRpbWUsXG4gICAgICAgICAgICB1dGNTdGFydFRpbWUgPSBEYXRlLlVUQyhzdGFydFRpbWUuZ2V0RnVsbFllYXIoKSwgc3RhcnRUaW1lLmdldE1vbnRoKCksIHN0YXJ0VGltZS5nZXREYXRlKCkpLFxuICAgICAgICAgICAgdXRjRW5kVGltZSA9IERhdGUuVVRDKGVuZFRpbWUuZ2V0RnVsbFllYXIoKSwgZW5kVGltZS5nZXRNb250aCgpLCBlbmRUaW1lLmdldERhdGUoKSksXG4gICAgICAgICAgICBjdXJyZW50Vmlld0luZGV4ID0gdGhpcy5jdXJyZW50Vmlld0luZGV4LFxuICAgICAgICAgICAgcm93cyA9IHRoaXMudmlld3NbY3VycmVudFZpZXdJbmRleF0ucm93cyxcbiAgICAgICAgICAgIGRhdGVzID0gdGhpcy52aWV3c1tjdXJyZW50Vmlld0luZGV4XS5kYXRlcyxcbiAgICAgICAgICAgIG9uZUhvdXIgPSAzNjAwMDAwLFxuICAgICAgICAgICAgb25lRGF5ID0gODY0MDAwMDAsXG4gICAgICAgICAgICAvLyBhZGQgYWxsZGF5IGVwc1xuICAgICAgICAgICAgZXBzID0gMC4wMTYsXG4gICAgICAgICAgICByYW5nZVN0YXJ0Um93SW5kZXggPSB0aGlzLnN0YXJ0SG91ciAqIHRoaXMuaG91clNlZ21lbnRzLFxuICAgICAgICAgICAgcmFuZ2VFbmRSb3dJbmRleCA9IHRoaXMuZW5kSG91ciAqIHRoaXMuaG91clNlZ21lbnRzLFxuICAgICAgICAgICAgYWxsUm93cyA9IDI0ICogdGhpcy5ob3VyU2VnbWVudHM7XG4gICAgICAgIGxldCBhbGxEYXlFdmVudEluUmFuZ2UgPSBmYWxzZSxcbiAgICAgICAgICAgIG5vcm1hbEV2ZW50SW5SYW5nZSA9IGZhbHNlO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNzsgaSArPSAxKSB7XG4gICAgICAgICAgICBkYXRlc1tpXS5ldmVudHMgPSBbXTtcbiAgICAgICAgICAgIGRhdGVzW2ldLmhhc0V2ZW50ID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBkYXkgPSAwOyBkYXkgPCA3OyBkYXkgKz0gMSkge1xuICAgICAgICAgICAgZm9yIChsZXQgaG91ciA9IDA7IGhvdXIgPCB0aGlzLmhvdXJSYW5nZTsgaG91ciArPSAxKSB7XG4gICAgICAgICAgICAgICAgcm93c1tob3VyXVtkYXldLmV2ZW50cyA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50ID0gZXZlbnRTb3VyY2VbaV07XG4gICAgICAgICAgICBjb25zdCBldmVudFN0YXJ0VGltZSA9IGV2ZW50LnN0YXJ0VGltZTtcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50RW5kVGltZSA9IGV2ZW50LmVuZFRpbWU7XG5cbiAgICAgICAgICAgIGxldCBldmVudFVUQ1N0YXJ0VGltZTogbnVtYmVyLFxuICAgICAgICAgICAgICAgIGV2ZW50VVRDRW5kVGltZTogbnVtYmVyO1xuXG4gICAgICAgICAgICBpZiAoZXZlbnQuYWxsRGF5KSB7XG4gICAgICAgICAgICAgICAgZXZlbnRVVENTdGFydFRpbWUgPSBldmVudFN0YXJ0VGltZS5nZXRUaW1lKCk7XG4gICAgICAgICAgICAgICAgZXZlbnRVVENFbmRUaW1lID0gZXZlbnRFbmRUaW1lLmdldFRpbWUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZXZlbnRVVENTdGFydFRpbWUgPSBEYXRlLlVUQyhldmVudFN0YXJ0VGltZS5nZXRGdWxsWWVhcigpLCBldmVudFN0YXJ0VGltZS5nZXRNb250aCgpLCBldmVudFN0YXJ0VGltZS5nZXREYXRlKCkpO1xuICAgICAgICAgICAgICAgIGV2ZW50VVRDRW5kVGltZSA9IERhdGUuVVRDKGV2ZW50RW5kVGltZS5nZXRGdWxsWWVhcigpLCBldmVudEVuZFRpbWUuZ2V0TW9udGgoKSwgZXZlbnRFbmRUaW1lLmdldERhdGUoKSArIDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZXZlbnRVVENFbmRUaW1lIDw9IHV0Y1N0YXJ0VGltZSB8fCBldmVudFVUQ1N0YXJ0VGltZSA+PSB1dGNFbmRUaW1lIHx8IGV2ZW50U3RhcnRUaW1lID49IGV2ZW50RW5kVGltZSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZXZlbnQuYWxsRGF5KSB7XG4gICAgICAgICAgICAgICAgYWxsRGF5RXZlbnRJblJhbmdlID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIGxldCBhbGxEYXlTdGFydEluZGV4OiBudW1iZXI7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50VVRDU3RhcnRUaW1lIDw9IHV0Y1N0YXJ0VGltZSkge1xuICAgICAgICAgICAgICAgICAgICBhbGxEYXlTdGFydEluZGV4ID0gMDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhbGxEYXlTdGFydEluZGV4ID0gTWF0aC5yb3VuZCgoZXZlbnRVVENTdGFydFRpbWUgLSB1dGNTdGFydFRpbWUpIC8gb25lRGF5KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZXQgYWxsRGF5RW5kSW5kZXg6IG51bWJlcjtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnRVVENFbmRUaW1lID49IHV0Y0VuZFRpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxsRGF5RW5kSW5kZXggPSBNYXRoLnJvdW5kKCh1dGNFbmRUaW1lIC0gdXRjU3RhcnRUaW1lKSAvIG9uZURheSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYWxsRGF5RW5kSW5kZXggPSBNYXRoLnJvdW5kKChldmVudFVUQ0VuZFRpbWUgLSB1dGNTdGFydFRpbWUpIC8gb25lRGF5KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBkaXNwbGF5QWxsRGF5RXZlbnQ6IElEaXNwbGF5RXZlbnQgPSB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LFxuICAgICAgICAgICAgICAgICAgICBzdGFydEluZGV4OiBhbGxEYXlTdGFydEluZGV4LFxuICAgICAgICAgICAgICAgICAgICBlbmRJbmRleDogYWxsRGF5RW5kSW5kZXhcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgbGV0IGV2ZW50U2V0ID0gZGF0ZXNbYWxsRGF5U3RhcnRJbmRleF0uZXZlbnRzO1xuICAgICAgICAgICAgICAgIGlmIChldmVudFNldCkge1xuICAgICAgICAgICAgICAgICAgICBldmVudFNldC5wdXNoKGRpc3BsYXlBbGxEYXlFdmVudCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRTZXQgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRTZXQucHVzaChkaXNwbGF5QWxsRGF5RXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICBkYXRlc1thbGxEYXlTdGFydEluZGV4XS5ldmVudHMgPSBldmVudFNldDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGF0ZXNbYWxsRGF5U3RhcnRJbmRleF0uaGFzRXZlbnQgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBub3JtYWxFdmVudEluUmFuZ2UgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgbGV0IHRpbWVEaWZmZXJlbmNlU3RhcnQ6IG51bWJlcjtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnRVVENTdGFydFRpbWUgPCB1dGNTdGFydFRpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGltZURpZmZlcmVuY2VTdGFydCA9IDA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGltZURpZmZlcmVuY2VTdGFydCA9IChldmVudFVUQ1N0YXJ0VGltZSAtIHV0Y1N0YXJ0VGltZSkgLyBvbmVIb3VyICogdGhpcy5ob3VyU2VnbWVudHMgKyAoZXZlbnRTdGFydFRpbWUuZ2V0SG91cnMoKSArIGV2ZW50U3RhcnRUaW1lLmdldE1pbnV0ZXMoKSAvIDYwKSAqIHRoaXMuaG91clNlZ21lbnRzO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldCB0aW1lRGlmZmVyZW5jZUVuZDogbnVtYmVyO1xuICAgICAgICAgICAgICAgIGlmIChldmVudFVUQ0VuZFRpbWUgPiB1dGNFbmRUaW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHRpbWVEaWZmZXJlbmNlRW5kID0gKHV0Y0VuZFRpbWUgLSB1dGNTdGFydFRpbWUpIC8gb25lSG91ciAqIHRoaXMuaG91clNlZ21lbnRzO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRpbWVEaWZmZXJlbmNlRW5kID0gKGV2ZW50VVRDRW5kVGltZSAtIG9uZURheSAtIHV0Y1N0YXJ0VGltZSkgLyBvbmVIb3VyICogdGhpcy5ob3VyU2VnbWVudHMgKyAoZXZlbnRFbmRUaW1lLmdldEhvdXJzKCkgKyBldmVudEVuZFRpbWUuZ2V0TWludXRlcygpIC8gNjApICogdGhpcy5ob3VyU2VnbWVudHM7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3Qgc3RhcnRJbmRleCA9IE1hdGguZmxvb3IodGltZURpZmZlcmVuY2VTdGFydCksXG4gICAgICAgICAgICAgICAgICAgIGVuZEluZGV4ID0gTWF0aC5jZWlsKHRpbWVEaWZmZXJlbmNlRW5kIC0gZXBzKTtcbiAgICAgICAgICAgICAgICBsZXQgc3RhcnRSb3dJbmRleCA9IHN0YXJ0SW5kZXggJSBhbGxSb3dzLFxuICAgICAgICAgICAgICAgICAgICBkYXlJbmRleCA9IE1hdGguZmxvb3Ioc3RhcnRJbmRleCAvIGFsbFJvd3MpLFxuICAgICAgICAgICAgICAgICAgICBlbmRPZkRheSA9IGRheUluZGV4ICogYWxsUm93cyxcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRPZmZzZXQgPSAwLFxuICAgICAgICAgICAgICAgICAgICBlbmRPZmZzZXQgPSAwO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaG91clBhcnRzICE9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGFydFJvd0luZGV4IDwgcmFuZ2VTdGFydFJvd0luZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydE9mZnNldCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydE9mZnNldCA9IE1hdGguZmxvb3IoKHRpbWVEaWZmZXJlbmNlU3RhcnQgLSBzdGFydEluZGV4KSAqIHRoaXMuaG91clBhcnRzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICAgICAgZW5kT2ZEYXkgKz0gYWxsUm93cztcbiAgICAgICAgICAgICAgICAgICAgbGV0IGVuZFJvd0luZGV4OiBudW1iZXI7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbmRPZkRheSA8IGVuZEluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRSb3dJbmRleCA9IGFsbFJvd3M7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZW5kT2ZEYXkgPT09IGVuZEluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kUm93SW5kZXggPSBhbGxSb3dzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRSb3dJbmRleCA9IGVuZEluZGV4ICUgYWxsUm93cztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmhvdXJQYXJ0cyAhPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbmRSb3dJbmRleCA+IHJhbmdlRW5kUm93SW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kT2Zmc2V0ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRPZmZzZXQgPSBNYXRoLmZsb29yKChlbmRJbmRleCAtIHRpbWVEaWZmZXJlbmNlRW5kKSAqIHRoaXMuaG91clBhcnRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXJ0Um93SW5kZXggPCByYW5nZVN0YXJ0Um93SW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0Um93SW5kZXggPSAwO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRSb3dJbmRleCAtPSByYW5nZVN0YXJ0Um93SW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGVuZFJvd0luZGV4ID4gcmFuZ2VFbmRSb3dJbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZW5kUm93SW5kZXggPSByYW5nZUVuZFJvd0luZGV4O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVuZFJvd0luZGV4IC09IHJhbmdlU3RhcnRSb3dJbmRleDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhcnRSb3dJbmRleCA8IGVuZFJvd0luZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkaXNwbGF5RXZlbnQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRJbmRleDogc3RhcnRSb3dJbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRJbmRleDogZW5kUm93SW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRPZmZzZXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kT2Zmc2V0XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGV2ZW50U2V0ID0gcm93c1tzdGFydFJvd0luZGV4XVtkYXlJbmRleF0uZXZlbnRzO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50U2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRTZXQucHVzaChkaXNwbGF5RXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudFNldCA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50U2V0LnB1c2goZGlzcGxheUV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dzW3N0YXJ0Um93SW5kZXhdW2RheUluZGV4XS5ldmVudHMgPSBldmVudFNldDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGVzW2RheUluZGV4XS5oYXNFdmVudCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc3RhcnRSb3dJbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0T2Zmc2V0ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgZGF5SW5kZXggKz0gMTtcbiAgICAgICAgICAgICAgICB9IHdoaWxlIChlbmRPZkRheSA8IGVuZEluZGV4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChub3JtYWxFdmVudEluUmFuZ2UpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGRheSA9IDA7IGRheSA8IDc7IGRheSArPSAxKSB7XG4gICAgICAgICAgICAgICAgbGV0IG9yZGVyZWRFdmVudHM6IElEaXNwbGF5RXZlbnRbXSA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGhvdXIgPSAwOyBob3VyIDwgdGhpcy5ob3VyUmFuZ2U7IGhvdXIgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocm93c1tob3VyXVtkYXldLmV2ZW50cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93c1tob3VyXVtkYXldLmV2ZW50cy5zb3J0KFdlZWtWaWV3Q29tcG9uZW50LmNvbXBhcmVFdmVudEJ5U3RhcnRPZmZzZXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXJlZEV2ZW50cyA9IG9yZGVyZWRFdmVudHMuY29uY2F0KHJvd3NbaG91cl1bZGF5XS5ldmVudHMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChvcmRlcmVkRXZlbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbGFjZUV2ZW50cyhvcmRlcmVkRXZlbnRzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYWxsRGF5RXZlbnRJblJhbmdlKSB7XG4gICAgICAgICAgICBsZXQgb3JkZXJlZEFsbERheUV2ZW50czogSURpc3BsYXlFdmVudFtdID0gW107XG4gICAgICAgICAgICBmb3IgKGxldCBkYXkgPSAwOyBkYXkgPCA3OyBkYXkgKz0gMSkge1xuICAgICAgICAgICAgICAgIGlmIChkYXRlc1tkYXldLmV2ZW50cykge1xuICAgICAgICAgICAgICAgICAgICBvcmRlcmVkQWxsRGF5RXZlbnRzID0gb3JkZXJlZEFsbERheUV2ZW50cy5jb25jYXQoZGF0ZXNbZGF5XS5ldmVudHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcmRlcmVkQWxsRGF5RXZlbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYWNlQWxsRGF5RXZlbnRzKG9yZGVyZWRBbGxEYXlFdmVudHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuYXV0b1NlbGVjdCkge1xuICAgICAgICAgICAgbGV0IGZpbmRTZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgbGV0IHNlbGVjdGVkRGF0ZTtcbiAgICAgICAgICAgIGZvciAobGV0IHIgPSAwOyByIDwgNzsgciArPSAxKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGVzW3JdLnNlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkRGF0ZSA9IGRhdGVzW3JdO1xuICAgICAgICAgICAgICAgICAgICBmaW5kU2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChmaW5kU2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICBsZXQgZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5tYXJrRGlzYWJsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQgPSB0aGlzLm1hcmtEaXNhYmxlZChzZWxlY3RlZERhdGUuZGF0ZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5vblRpbWVTZWxlY3RlZC5lbWl0KHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRUaW1lOiBzZWxlY3RlZERhdGUuZGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRzOiBzZWxlY3RlZERhdGUuZXZlbnRzLm1hcChlID0+IGUuZXZlbnQpLFxuICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVmcmVzaFZpZXcoKSB7XG4gICAgICAgIHRoaXMucmFuZ2UgPSB0aGlzLmdldFJhbmdlKHRoaXMuY2FsZW5kYXJTZXJ2aWNlLmN1cnJlbnREYXRlKTtcblxuICAgICAgICBpZiAodGhpcy5pbml0ZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IHRpdGxlID0gdGhpcy5nZXRUaXRsZSgpO1xuICAgICAgICAgICAgdGhpcy5vblRpdGxlQ2hhbmdlZC5lbWl0KHRpdGxlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNhbGVuZGFyU2VydmljZS5wb3B1bGF0ZUFkamFjZW50Vmlld3ModGhpcyk7XG4gICAgICAgIHRoaXMudXBkYXRlQ3VycmVudFZpZXcodGhpcy5yYW5nZS5zdGFydFRpbWUsIHRoaXMudmlld3NbdGhpcy5jdXJyZW50Vmlld0luZGV4XSk7XG4gICAgICAgIHRoaXMuY2FsZW5kYXJTZXJ2aWNlLnJhbmdlQ2hhbmdlZCh0aGlzKTtcbiAgICB9XG5cbiAgICBnZXRUaXRsZSgpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCBmaXJzdERheU9mV2VlayA9IG5ldyBEYXRlKHRoaXMucmFuZ2Uuc3RhcnRUaW1lLmdldFRpbWUoKSk7XG4gICAgICAgIGZpcnN0RGF5T2ZXZWVrLnNldEhvdXJzKDEyLCAwLCAwLCAwKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZm9ybWF0VGl0bGUoZmlyc3REYXlPZldlZWspO1xuICAgIH1cblxuICAgIGdldEhpZ2hsaWdodENsYXNzKGRhdGU6IElXZWVrVmlld0RhdGVSb3cpOiBzdHJpbmcge1xuICAgICAgICBsZXQgY2xhc3NOYW1lID0gJyc7XG5cbiAgICAgICAgaWYgKGRhdGUuaGFzRXZlbnQpIHtcbiAgICAgICAgICAgIGlmIChjbGFzc05hbWUpIHtcbiAgICAgICAgICAgICAgICBjbGFzc05hbWUgKz0gJyAnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2xhc3NOYW1lID0gJ3dlZWt2aWV3LXdpdGgtZXZlbnQnO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRhdGUuc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgIGlmIChjbGFzc05hbWUpIHtcbiAgICAgICAgICAgICAgICBjbGFzc05hbWUgKz0gJyAnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2xhc3NOYW1lICs9ICd3ZWVrdmlldy1zZWxlY3RlZCc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZGF0ZS5jdXJyZW50KSB7XG4gICAgICAgICAgICBpZiAoY2xhc3NOYW1lKSB7XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lICs9ICcgJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNsYXNzTmFtZSArPSAnd2Vla3ZpZXctY3VycmVudCc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY2xhc3NOYW1lO1xuICAgIH1cblxuICAgIHNlbGVjdChzZWxlY3RlZFRpbWU6IERhdGUsIGV2ZW50czogSURpc3BsYXlFdmVudFtdKSB7XG4gICAgICAgIGxldCBkaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5tYXJrRGlzYWJsZWQpIHtcbiAgICAgICAgICAgIGRpc2FibGVkID0gdGhpcy5tYXJrRGlzYWJsZWQoc2VsZWN0ZWRUaW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMub25UaW1lU2VsZWN0ZWQuZW1pdCh7XG4gICAgICAgICAgICBzZWxlY3RlZFRpbWUsXG4gICAgICAgICAgICBldmVudHM6IGV2ZW50cy5tYXAoZSA9PiBlLmV2ZW50KSxcbiAgICAgICAgICAgIGRpc2FibGVkXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHBsYWNlRXZlbnRzKG9yZGVyZWRFdmVudHM6IElEaXNwbGF5RXZlbnRbXSkge1xuICAgICAgICB0aGlzLmNhbGN1bGF0ZVBvc2l0aW9uKG9yZGVyZWRFdmVudHMpO1xuICAgICAgICBXZWVrVmlld0NvbXBvbmVudC5jYWxjdWxhdGVXaWR0aChvcmRlcmVkRXZlbnRzLCB0aGlzLmhvdXJSYW5nZSwgdGhpcy5ob3VyUGFydHMpO1xuICAgIH1cblxuICAgIHBsYWNlQWxsRGF5RXZlbnRzKG9yZGVyZWRFdmVudHM6IElEaXNwbGF5RXZlbnRbXSkge1xuICAgICAgICB0aGlzLmNhbGN1bGF0ZVBvc2l0aW9uKG9yZGVyZWRFdmVudHMpO1xuICAgIH1cblxuICAgIG92ZXJsYXAoZXZlbnQxOiBJRGlzcGxheUV2ZW50LCBldmVudDI6IElEaXNwbGF5RXZlbnQpOiBib29sZWFuIHtcbiAgICAgICAgbGV0IGVhcmx5RXZlbnQgPSBldmVudDEsXG4gICAgICAgICAgICBsYXRlRXZlbnQgPSBldmVudDI7XG4gICAgICAgIGlmIChldmVudDEuc3RhcnRJbmRleCA+IGV2ZW50Mi5zdGFydEluZGV4IHx8IChldmVudDEuc3RhcnRJbmRleCA9PT0gZXZlbnQyLnN0YXJ0SW5kZXggJiYgZXZlbnQxLnN0YXJ0T2Zmc2V0ID4gZXZlbnQyLnN0YXJ0T2Zmc2V0KSkge1xuICAgICAgICAgICAgZWFybHlFdmVudCA9IGV2ZW50MjtcbiAgICAgICAgICAgIGxhdGVFdmVudCA9IGV2ZW50MTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlYXJseUV2ZW50LmVuZEluZGV4IDw9IGxhdGVFdmVudC5zdGFydEluZGV4KSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gIShlYXJseUV2ZW50LmVuZEluZGV4IC0gbGF0ZUV2ZW50LnN0YXJ0SW5kZXggPT09IDEgJiYgZWFybHlFdmVudC5lbmRPZmZzZXQgKyBsYXRlRXZlbnQuc3RhcnRPZmZzZXQgPj0gdGhpcy5ob3VyUGFydHMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlUG9zaXRpb24oZXZlbnRzOiBJRGlzcGxheUV2ZW50W10pIHtcbiAgICAgICAgY29uc3QgbGVuID0gZXZlbnRzLmxlbmd0aCxcbiAgICAgICAgICAgIGlzRm9yYmlkZGVuID0gbmV3IEFycmF5KGxlbik7XG4gICAgICAgIGxldCBtYXhDb2x1bW4gPSAwO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGxldCBjb2w6IG51bWJlcjtcbiAgICAgICAgICAgIGZvciAoY29sID0gMDsgY29sIDwgbWF4Q29sdW1uOyBjb2wgKz0gMSkge1xuICAgICAgICAgICAgICAgIGlzRm9yYmlkZGVuW2NvbF0gPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgaTsgaiArPSAxKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3ZlcmxhcChldmVudHNbaV0sIGV2ZW50c1tqXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNGb3JiaWRkZW5bZXZlbnRzW2pdLnBvc2l0aW9uXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChjb2wgPSAwOyBjb2wgPCBtYXhDb2x1bW47IGNvbCArPSAxKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFpc0ZvcmJpZGRlbltjb2xdKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjb2wgPCBtYXhDb2x1bW4pIHtcbiAgICAgICAgICAgICAgICBldmVudHNbaV0ucG9zaXRpb24gPSBjb2w7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGV2ZW50c1tpXS5wb3NpdGlvbiA9IG1heENvbHVtbisrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZGlyID09PSAncnRsJykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgIGV2ZW50c1tpXS5wb3NpdGlvbiA9IG1heENvbHVtbiAtIDEgLSBldmVudHNbaV0ucG9zaXRpb247XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVDdXJyZW50VmlldyhjdXJyZW50Vmlld1N0YXJ0RGF0ZTogRGF0ZSwgdmlldzogSVdlZWtWaWV3KSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRDYWxlbmRhckRhdGUgPSB0aGlzLmNhbGVuZGFyU2VydmljZS5jdXJyZW50RGF0ZSxcbiAgICAgICAgICAgIHRvZGF5ID0gbmV3IERhdGUoKSxcbiAgICAgICAgICAgIG9uZURheSA9IDg2NDAwMDAwLFxuICAgICAgICAgICAgc2VsZWN0ZWREYXlEaWZmZXJlbmNlID0gTWF0aC5yb3VuZCgoRGF0ZS5VVEMoY3VycmVudENhbGVuZGFyRGF0ZS5nZXRGdWxsWWVhcigpLCBjdXJyZW50Q2FsZW5kYXJEYXRlLmdldE1vbnRoKCksIGN1cnJlbnRDYWxlbmRhckRhdGUuZ2V0RGF0ZSgpKSAtIERhdGUuVVRDKGN1cnJlbnRWaWV3U3RhcnREYXRlLmdldEZ1bGxZZWFyKCksIGN1cnJlbnRWaWV3U3RhcnREYXRlLmdldE1vbnRoKCksIGN1cnJlbnRWaWV3U3RhcnREYXRlLmdldERhdGUoKSkpIC8gb25lRGF5KSxcbiAgICAgICAgICAgIGN1cnJlbnREYXlEaWZmZXJlbmNlID0gTWF0aC5mbG9vcigoRGF0ZS5VVEModG9kYXkuZ2V0RnVsbFllYXIoKSwgdG9kYXkuZ2V0TW9udGgoKSwgdG9kYXkuZ2V0RGF0ZSgpKSAtIERhdGUuVVRDKGN1cnJlbnRWaWV3U3RhcnREYXRlLmdldEZ1bGxZZWFyKCksIGN1cnJlbnRWaWV3U3RhcnREYXRlLmdldE1vbnRoKCksIGN1cnJlbnRWaWV3U3RhcnREYXRlLmdldERhdGUoKSkpIC8gb25lRGF5KTtcblxuICAgICAgICBmb3IgKGxldCByID0gMDsgciA8IDc7IHIgKz0gMSkge1xuICAgICAgICAgICAgdmlldy5kYXRlc1tyXS5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNlbGVjdGVkRGF5RGlmZmVyZW5jZSA+PSAwICYmIHNlbGVjdGVkRGF5RGlmZmVyZW5jZSA8IDcgJiYgdGhpcy5hdXRvU2VsZWN0KSB7XG4gICAgICAgICAgICB2aWV3LmRhdGVzW3NlbGVjdGVkRGF5RGlmZmVyZW5jZV0uc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGN1cnJlbnREYXlEaWZmZXJlbmNlID49IDAgJiYgY3VycmVudERheURpZmZlcmVuY2UgPCA3KSB7XG4gICAgICAgICAgICB2aWV3LmRhdGVzW2N1cnJlbnREYXlEaWZmZXJlbmNlXS5jdXJyZW50ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRheVNlbGVjdGVkKHZpZXdEYXRlOiBJV2Vla1ZpZXdEYXRlUm93KSB7XG4gICAgICAgIGNvbnN0IHNlbGVjdGVkRGF0ZSA9IHZpZXdEYXRlLmRhdGUsXG4gICAgICAgICAgICBkYXRlcyA9IHRoaXMudmlld3NbdGhpcy5jdXJyZW50Vmlld0luZGV4XS5kYXRlcyxcbiAgICAgICAgICAgIGN1cnJlbnRWaWV3U3RhcnREYXRlID0gdGhpcy5yYW5nZS5zdGFydFRpbWUsXG4gICAgICAgICAgICBvbmVEYXkgPSA4NjQwMDAwMCxcbiAgICAgICAgICAgIHNlbGVjdGVkRGF5RGlmZmVyZW5jZSA9IE1hdGgucm91bmQoKERhdGUuVVRDKHNlbGVjdGVkRGF0ZS5nZXRGdWxsWWVhcigpLCBzZWxlY3RlZERhdGUuZ2V0TW9udGgoKSwgc2VsZWN0ZWREYXRlLmdldERhdGUoKSkgLSBEYXRlLlVUQyhjdXJyZW50Vmlld1N0YXJ0RGF0ZS5nZXRGdWxsWWVhcigpLCBjdXJyZW50Vmlld1N0YXJ0RGF0ZS5nZXRNb250aCgpLCBjdXJyZW50Vmlld1N0YXJ0RGF0ZS5nZXREYXRlKCkpKSAvIG9uZURheSk7XG5cbiAgICAgICAgdGhpcy5jYWxlbmRhclNlcnZpY2Uuc2V0Q3VycmVudERhdGUoc2VsZWN0ZWREYXRlKTtcblxuICAgICAgICBmb3IgKGxldCByID0gMDsgciA8IDc7IHIgKz0gMSkge1xuICAgICAgICAgICAgZGF0ZXNbcl0uc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzZWxlY3RlZERheURpZmZlcmVuY2UgPj0gMCAmJiBzZWxlY3RlZERheURpZmZlcmVuY2UgPCA3KSB7XG4gICAgICAgICAgICBkYXRlc1tzZWxlY3RlZERheURpZmZlcmVuY2VdLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBkaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5tYXJrRGlzYWJsZWQpIHtcbiAgICAgICAgICAgIGRpc2FibGVkID0gdGhpcy5tYXJrRGlzYWJsZWQoc2VsZWN0ZWREYXRlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMub25EYXlIZWFkZXJTZWxlY3RlZC5lbWl0KHtzZWxlY3RlZFRpbWU6IHNlbGVjdGVkRGF0ZSwgZXZlbnRzOiB2aWV3RGF0ZS5ldmVudHMubWFwKGUgPT4gZS5ldmVudCksIGRpc2FibGVkfSk7XG4gICAgfVxuXG4gICAgc2V0U2Nyb2xsUG9zaXRpb24oc2Nyb2xsUG9zaXRpb246IG51bWJlcikge1xuICAgICAgICB0aGlzLmluaXRTY3JvbGxQb3NpdGlvbiA9IHNjcm9sbFBvc2l0aW9uO1xuICAgIH1cbn1cbiJdfQ==