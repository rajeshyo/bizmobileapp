var DayViewComponent_1;
import { __decorate } from "tslib";
import { DatePipe } from '@angular/common';
import { Component, OnInit, OnChanges, HostBinding, Input, Output, EventEmitter, SimpleChanges, ViewChild, ViewEncapsulation, TemplateRef, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CalendarService } from './calendar.service';
let DayViewComponent = DayViewComponent_1 = class DayViewComponent {
    constructor(calendarService, elm) {
        this.calendarService = calendarService;
        this.elm = elm;
        this.class = true;
        this.dir = '';
        this.scrollToHour = 0;
        this.onRangeChanged = new EventEmitter();
        this.onEventSelected = new EventEmitter();
        this.onTimeSelected = new EventEmitter();
        this.onTitleChanged = new EventEmitter(true);
        this.views = [];
        this.currentViewIndex = 0;
        this.direction = 0;
        this.mode = 'day';
        this.inited = false;
        this.callbackOnInit = true;
    }
    static createDateObjects(startTime, startHour, endHour, timeInterval) {
        const rows = [], currentHour = 0, currentDate = startTime.getDate();
        let time, hourStep, minStep;
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
                time = new Date(startTime.getTime());
                time.setHours(currentHour + hour, interval);
                time.setDate(currentDate);
                rows.push({
                    time,
                    events: []
                });
            }
        }
        return rows;
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
        if (this.dateFormatter && this.dateFormatter.formatDayViewTitle) {
            this.formatTitle = this.dateFormatter.formatDayViewTitle;
        }
        else {
            const datePipe = new DatePipe(this.locale);
            this.formatTitle = function (date) {
                return datePipe.transform(date, this.formatDayTitle);
            };
        }
        if (this.dateFormatter && this.dateFormatter.formatDayViewHourColumn) {
            this.formatHourColumnLabel = this.dateFormatter.formatDayViewHourColumn;
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
            const hourColumns = this.elm.nativeElement.querySelector('.dayview-normal-event-container').querySelectorAll('.calendar-hour-column');
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
        let direction = 0;
        const currentViewIndex = this.currentViewIndex;
        this.slider.getActiveIndex().then((currentSlideIndex) => {
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
        const adjacentDate = this.calendarService.getAdjacentCalendarDate(this.mode, direction);
        this.calendarService.setCurrentDate(adjacentDate);
        this.refreshView();
        this.direction = 0;
    }
    getHourColumnLabels() {
        const hourColumnLabels = [];
        for (let hour = 0, length = this.views[0].rows.length; hour < length; hour += 1) {
            // handle edge case for DST
            if (hour === 0 && this.views[0].rows[hour].time.getHours() !== this.startHour) {
                const time = new Date(this.views[0].rows[hour].time);
                time.setDate(time.getDate() + 1);
                time.setHours(this.startHour);
                hourColumnLabels.push(this.formatHourColumnLabel(time));
            }
            else {
                hourColumnLabels.push(this.formatHourColumnLabel(this.views[0].rows[hour].time));
            }
        }
        return hourColumnLabels;
    }
    getViewData(startTime) {
        return {
            rows: DayViewComponent_1.createDateObjects(startTime, this.startHour, this.endHour, this.hourSegments),
            allDayEvents: []
        };
    }
    getRange(currentDate) {
        const year = currentDate.getFullYear(), month = currentDate.getMonth(), date = currentDate.getDate(), startTime = new Date(year, month, date, 12, 0, 0), endTime = new Date(year, month, date + 1, 12, 0, 0);
        return {
            startTime,
            endTime
        };
    }
    onDataLoaded() {
        const eventSource = this.eventSource, len = eventSource ? eventSource.length : 0, startTime = this.range.startTime, endTime = this.range.endTime, utcStartTime = Date.UTC(startTime.getFullYear(), startTime.getMonth(), startTime.getDate()), utcEndTime = Date.UTC(endTime.getFullYear(), endTime.getMonth(), endTime.getDate()), currentViewIndex = this.currentViewIndex, rows = this.views[currentViewIndex].rows, allDayEvents = this.views[currentViewIndex].allDayEvents = [], oneHour = 3600000, eps = 0.016, rangeStartRowIndex = this.startHour * this.hourSegments, rangeEndRowIndex = this.endHour * this.hourSegments;
        let normalEventInRange = false;
        for (let hour = 0; hour < this.hourRange; hour += 1) {
            rows[hour].events = [];
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
                allDayEvents.push({
                    event
                });
            }
            else {
                normalEventInRange = true;
                let timeDifferenceStart;
                if (eventUTCStartTime < utcStartTime) {
                    timeDifferenceStart = 0;
                }
                else {
                    timeDifferenceStart = (eventStartTime.getHours() + eventStartTime.getMinutes() / 60) * this.hourSegments;
                }
                let timeDifferenceEnd;
                if (eventUTCEndTime > utcEndTime) {
                    timeDifferenceEnd = (utcEndTime - utcStartTime) / oneHour * this.hourSegments;
                }
                else {
                    timeDifferenceEnd = (eventEndTime.getHours() + eventEndTime.getMinutes() / 60) * this.hourSegments;
                }
                let startIndex = Math.floor(timeDifferenceStart);
                let endIndex = Math.ceil(timeDifferenceEnd - eps);
                let startOffset = 0;
                let endOffset = 0;
                if (this.hourParts !== 1) {
                    if (startIndex < rangeStartRowIndex) {
                        startOffset = 0;
                    }
                    else {
                        startOffset = Math.floor((timeDifferenceStart - startIndex) * this.hourParts);
                    }
                    if (endIndex > rangeEndRowIndex) {
                        endOffset = 0;
                    }
                    else {
                        endOffset = Math.floor((endIndex - timeDifferenceEnd) * this.hourParts);
                    }
                }
                if (startIndex < rangeStartRowIndex) {
                    startIndex = 0;
                }
                else {
                    startIndex -= rangeStartRowIndex;
                }
                if (endIndex > rangeEndRowIndex) {
                    endIndex = rangeEndRowIndex;
                }
                endIndex -= rangeStartRowIndex;
                if (startIndex < endIndex) {
                    const displayEvent = {
                        event,
                        startIndex,
                        endIndex,
                        startOffset,
                        endOffset
                    };
                    let eventSet = rows[startIndex].events;
                    if (eventSet) {
                        eventSet.push(displayEvent);
                    }
                    else {
                        eventSet = [];
                        eventSet.push(displayEvent);
                        rows[startIndex].events = eventSet;
                    }
                }
            }
        }
        if (normalEventInRange) {
            let orderedEvents = [];
            for (let hour = 0; hour < this.hourRange; hour += 1) {
                if (rows[hour].events) {
                    rows[hour].events.sort(DayViewComponent_1.compareEventByStartOffset);
                    orderedEvents = orderedEvents.concat(rows[hour].events);
                }
            }
            if (orderedEvents.length > 0) {
                this.placeEvents(orderedEvents);
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
        this.calendarService.rangeChanged(this);
    }
    getTitle() {
        const startingDate = new Date(this.range.startTime.getTime());
        startingDate.setHours(12, 0, 0, 0);
        return this.formatTitle(startingDate);
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
        DayViewComponent_1.calculateWidth(orderedEvents, this.hourRange, this.hourParts);
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
        let maxColumn = 0, col;
        for (let i = 0; i < len; i += 1) {
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
    eventSelected(event) {
        this.onEventSelected.emit(event);
    }
    setScrollPosition(scrollPosition) {
        this.initScrollPosition = scrollPosition;
    }
};
DayViewComponent.ctorParameters = () => [
    { type: CalendarService },
    { type: ElementRef }
];
__decorate([
    ViewChild('daySlider', { static: true })
], DayViewComponent.prototype, "slider", void 0);
__decorate([
    HostBinding('class.dayview')
], DayViewComponent.prototype, "class", void 0);
__decorate([
    Input()
], DayViewComponent.prototype, "dayviewAllDayEventTemplate", void 0);
__decorate([
    Input()
], DayViewComponent.prototype, "dayviewNormalEventTemplate", void 0);
__decorate([
    Input()
], DayViewComponent.prototype, "dayviewAllDayEventSectionTemplate", void 0);
__decorate([
    Input()
], DayViewComponent.prototype, "dayviewNormalEventSectionTemplate", void 0);
__decorate([
    Input()
], DayViewComponent.prototype, "dayviewInactiveAllDayEventSectionTemplate", void 0);
__decorate([
    Input()
], DayViewComponent.prototype, "dayviewInactiveNormalEventSectionTemplate", void 0);
__decorate([
    Input()
], DayViewComponent.prototype, "formatHourColumn", void 0);
__decorate([
    Input()
], DayViewComponent.prototype, "formatDayTitle", void 0);
__decorate([
    Input()
], DayViewComponent.prototype, "allDayLabel", void 0);
__decorate([
    Input()
], DayViewComponent.prototype, "hourParts", void 0);
__decorate([
    Input()
], DayViewComponent.prototype, "eventSource", void 0);
__decorate([
    Input()
], DayViewComponent.prototype, "markDisabled", void 0);
__decorate([
    Input()
], DayViewComponent.prototype, "locale", void 0);
__decorate([
    Input()
], DayViewComponent.prototype, "dateFormatter", void 0);
__decorate([
    Input()
], DayViewComponent.prototype, "dir", void 0);
__decorate([
    Input()
], DayViewComponent.prototype, "scrollToHour", void 0);
__decorate([
    Input()
], DayViewComponent.prototype, "preserveScrollPosition", void 0);
__decorate([
    Input()
], DayViewComponent.prototype, "lockSwipeToPrev", void 0);
__decorate([
    Input()
], DayViewComponent.prototype, "lockSwipes", void 0);
__decorate([
    Input()
], DayViewComponent.prototype, "startHour", void 0);
__decorate([
    Input()
], DayViewComponent.prototype, "endHour", void 0);
__decorate([
    Input()
], DayViewComponent.prototype, "sliderOptions", void 0);
__decorate([
    Input()
], DayViewComponent.prototype, "hourSegments", void 0);
__decorate([
    Output()
], DayViewComponent.prototype, "onRangeChanged", void 0);
__decorate([
    Output()
], DayViewComponent.prototype, "onEventSelected", void 0);
__decorate([
    Output()
], DayViewComponent.prototype, "onTimeSelected", void 0);
__decorate([
    Output()
], DayViewComponent.prototype, "onTitleChanged", void 0);
DayViewComponent = DayViewComponent_1 = __decorate([
    Component({
        selector: 'dayview',
        template: `
        <ion-slides #daySlider [options]="sliderOptions" [dir]="dir" (ionSlideDidChange)="onSlideChanged()" class="slides-container">
            <ion-slide class="slide-container">
                <div class="dayview-allday-table">
                    <div class="dayview-allday-label">{{allDayLabel}}</div>
                    <div class="dayview-allday-content-wrapper scroll-content">
                        <table class="table table-bordered dayview-allday-content-table">
                            <tbody>
                            <tr>
                                <td class="calendar-cell" [ngClass]="{'calendar-event-wrap':views[0].allDayEvents.length>0}"
                                    [ngStyle]="{height: 25*views[0].allDayEvents.length+'px'}"
                                    *ngIf="0===currentViewIndex">
                                    <ng-template [ngTemplateOutlet]="dayviewAllDayEventSectionTemplate"
                                                 [ngTemplateOutletContext]="{allDayEvents:views[0].allDayEvents,eventTemplate:dayviewAllDayEventTemplate}">
                                    </ng-template>
                                </td>
                                <td class="calendar-cell" *ngIf="0!==currentViewIndex">
                                    <ng-template [ngTemplateOutlet]="dayviewInactiveAllDayEventSectionTemplate"
                                                 [ngTemplateOutletContext]="{allDayEvents:views[0].allDayEvents}">
                                    </ng-template>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <init-position-scroll *ngIf="0===currentViewIndex" class="dayview-normal-event-container"
                                      [initPosition]="initScrollPosition" [emitEvent]="preserveScrollPosition"
                                      (onScroll)="setScrollPosition($event)">
                    <table class="table table-bordered table-fixed dayview-normal-event-table">
                        <tbody>
                        <tr *ngFor="let tm of views[0].rows; let i = index">
                            <td class="calendar-hour-column text-center">
                                {{hourColumnLabels[i]}}
                            </td>
                            <td class="calendar-cell" tappable (click)="select(tm.time, tm.events)">
                                <ng-template [ngTemplateOutlet]="dayviewNormalEventSectionTemplate"
                                             [ngTemplateOutletContext]="{tm:tm, hourParts: hourParts, eventTemplate:dayviewNormalEventTemplate}">
                                </ng-template>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </init-position-scroll>
                <init-position-scroll *ngIf="0!==currentViewIndex" class="dayview-normal-event-container"
                                      [initPosition]="initScrollPosition">
                    <table class="table table-bordered table-fixed dayview-normal-event-table">
                        <tbody>
                        <tr *ngFor="let tm of views[0].rows; let i = index">
                            <td class="calendar-hour-column text-center">
                                {{hourColumnLabels[i]}}
                            </td>
                            <td class="calendar-cell">
                                <ng-template [ngTemplateOutlet]="dayviewInactiveNormalEventSectionTemplate"
                                             [ngTemplateOutletContext]="{tm:tm, hourParts: hourParts}">
                                </ng-template>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </init-position-scroll>
            </ion-slide>
            <ion-slide class="slide-container">
                <div class="dayview-allday-table">
                    <div class="dayview-allday-label">{{allDayLabel}}</div>
                    <div class="dayview-allday-content-wrapper scroll-content">
                        <table class="table table-bordered dayview-allday-content-table">
                            <tbody>
                            <tr>
                                <td class="calendar-cell" [ngClass]="{'calendar-event-wrap':views[1].allDayEvents.length>0}"
                                    [ngStyle]="{height: 25*views[1].allDayEvents.length+'px'}"
                                    *ngIf="1===currentViewIndex">
                                    <ng-template [ngTemplateOutlet]="dayviewAllDayEventSectionTemplate"
                                                 [ngTemplateOutletContext]="{allDayEvents:views[1].allDayEvents,eventTemplate:dayviewAllDayEventTemplate}">
                                    </ng-template>
                                </td>
                                <td class="calendar-cell" *ngIf="1!==currentViewIndex">
                                    <ng-template [ngTemplateOutlet]="dayviewInactiveAllDayEventSectionTemplate"
                                                 [ngTemplateOutletContext]="{allDayEvents:views[1].allDayEvents}">
                                    </ng-template>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <init-position-scroll *ngIf="1===currentViewIndex" class="dayview-normal-event-container"
                                      [initPosition]="initScrollPosition" [emitEvent]="preserveScrollPosition"
                                      (onScroll)="setScrollPosition($event)">
                    <table class="table table-bordered table-fixed dayview-normal-event-table">
                        <tbody>
                        <tr *ngFor="let tm of views[1].rows; let i = index">
                            <td class="calendar-hour-column text-center">
                                {{hourColumnLabels[i]}}
                            </td>
                            <td class="calendar-cell" tappable (click)="select(tm.time, tm.events)">
                                <ng-template [ngTemplateOutlet]="dayviewNormalEventSectionTemplate"
                                             [ngTemplateOutletContext]="{tm:tm, hourParts: hourParts, eventTemplate:dayviewNormalEventTemplate}">
                                </ng-template>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </init-position-scroll>
                <init-position-scroll *ngIf="1!==currentViewIndex" class="dayview-normal-event-container"
                                      [initPosition]="initScrollPosition">
                    <table class="table table-bordered table-fixed dayview-normal-event-table">
                        <tbody>
                        <tr *ngFor="let tm of views[1].rows; let i = index">
                            <td class="calendar-hour-column text-center">
                                {{hourColumnLabels[i]}}
                            </td>
                            <td class="calendar-cell">
                                <ng-template [ngTemplateOutlet]="dayviewInactiveNormalEventSectionTemplate"
                                             [ngTemplateOutletContext]="{tm:tm, hourParts: hourParts}">
                                </ng-template>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </init-position-scroll>
            </ion-slide>
            <ion-slide class="slide-container">
                <div class="dayview-allday-table">
                    <div class="dayview-allday-label">{{allDayLabel}}</div>
                    <div class="dayview-allday-content-wrapper scroll-content">
                        <table class="table table-bordered dayview-allday-content-table">
                            <tbody>
                            <tr>
                                <td class="calendar-cell" [ngClass]="{'calendar-event-wrap':views[2].allDayEvents.length>0}"
                                    [ngStyle]="{height: 25*views[2].allDayEvents.length+'px'}"
                                    *ngIf="2===currentViewIndex">
                                    <ng-template [ngTemplateOutlet]="dayviewAllDayEventSectionTemplate"
                                                 [ngTemplateOutletContext]="{allDayEvents:views[2].allDayEvents,eventTemplate:dayviewAllDayEventTemplate}">
                                    </ng-template>
                                </td>
                                <td class="calendar-cell" *ngIf="2!==currentViewIndex">
                                    <ng-template [ngTemplateOutlet]="dayviewInactiveAllDayEventSectionTemplate"
                                                 [ngTemplateOutletContext]="{allDayEvents:views[2].allDayEvents}">
                                    </ng-template>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <init-position-scroll *ngIf="2===currentViewIndex" class="dayview-normal-event-container"
                                      [initPosition]="initScrollPosition" [emitEvent]="preserveScrollPosition"
                                      (onScroll)="setScrollPosition($event)">
                    <table class="table table-bordered table-fixed dayview-normal-event-table">
                        <tbody>
                        <tr *ngFor="let tm of views[2].rows; let i = index">
                            <td class="calendar-hour-column text-center">
                                {{hourColumnLabels[i]}}
                            </td>
                            <td class="calendar-cell" tappable (click)="select(tm.time, tm.events)">
                                <ng-template [ngTemplateOutlet]="dayviewNormalEventSectionTemplate"
                                             [ngTemplateOutletContext]="{tm:tm, hourParts: hourParts, eventTemplate:dayviewNormalEventTemplate}">
                                </ng-template>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </init-position-scroll>
                <init-position-scroll *ngIf="2!==currentViewIndex" class="dayview-normal-event-container"
                                      [initPosition]="initScrollPosition">
                    <table class="table table-bordered table-fixed dayview-normal-event-table">
                        <tbody>
                        <tr *ngFor="let tm of views[2].rows; let i = index">
                            <td class="calendar-hour-column text-center">
                                {{hourColumnLabels[i]}}
                            </td>
                            <td class="calendar-cell">
                                <ng-template [ngTemplateOutlet]="dayviewInactiveNormalEventSectionTemplate"
                                             [ngTemplateOutletContext]="{tm:tm, hourParts: hourParts}">
                                </ng-template>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </init-position-scroll>
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

        .slides-container {
            height: 100%;
        }

        .slide-container {
            display: block;
        }

        .calendar-cell {
            padding: 0 !important;
            height: 37px;
        }

        .dayview-allday-label {
            float: left;
            height: 100%;
            line-height: 50px;
            text-align: center;
            width: 50px;
            border-left: 1px solid #ddd;
        }

        [dir="rtl"] .dayview-allday-label {
            border-right: 1px solid #ddd;
            float: right;
        }

        .dayview-allday-content-wrapper {
            margin-left: 50px;
            overflow: hidden;
            height: 51px;
        }

        [dir="rtl"] .dayview-allday-content-wrapper {
            margin-left: 0;
            margin-right: 50px;
        }

        .dayview-allday-content-table {
            min-height: 50px;
        }

        .dayview-allday-content-table td {
            border-left: 1px solid #ddd;
            border-right: 1px solid #ddd;
        }

        .dayview-allday-table {
            height: 50px;
            position: relative;
            border-bottom: 1px solid #ddd;
            font-size: 14px;
        }

        .dayview-normal-event-container {
            margin-top: 50px;
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
            .dayview-allday-label, .calendar-hour-column {
                width: 31px;
                font-size: 12px;
            }

            .dayview-allday-label {
                padding-top: 4px;
            }

            .table > tbody > tr > td.calendar-hour-column {
                padding-left: 0;
                padding-right: 0;
                vertical-align: middle;
                line-height: 12px;
            }

            .dayview-allday-label {
                line-height: 20px;
            }

            .dayview-allday-content-wrapper {
                margin-left: 31px;
            }

            [dir="rtl"] .dayview-allday-content-wrapper {
                margin-left: 0;
                margin-right: 31px;
            }
        }
    `]
    })
], DayViewComponent);
export { DayViewComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF5dmlldy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2lvbmljMi1jYWxlbmRhci8iLCJzb3VyY2VzIjpbImRheXZpZXcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFFekMsT0FBTyxFQUNILFNBQVMsRUFDVCxNQUFNLEVBQ04sU0FBUyxFQUNULFdBQVcsRUFDWCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDWixhQUFhLEVBQ2IsU0FBUyxFQUNULGlCQUFpQixFQUNqQixXQUFXLEVBQ1gsVUFBVSxFQUNWLGFBQWEsRUFBRSxTQUFTLEVBQzNCLE1BQU0sZUFBZSxDQUFDO0FBY3ZCLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQWlYbkQsSUFBYSxnQkFBZ0Isd0JBQTdCLE1BQWEsZ0JBQWdCO0lBRXpCLFlBQW9CLGVBQWdDLEVBQVUsR0FBZTtRQUF6RCxvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7UUFBVSxRQUFHLEdBQUgsR0FBRyxDQUFZO1FBSS9DLFVBQUssR0FBRyxJQUFJLENBQUM7UUFpQmxDLFFBQUcsR0FBRyxFQUFFLENBQUM7UUFDVCxpQkFBWSxHQUFHLENBQUMsQ0FBQztRQVNoQixtQkFBYyxHQUFHLElBQUksWUFBWSxFQUFVLENBQUM7UUFDNUMsb0JBQWUsR0FBRyxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQzdDLG1CQUFjLEdBQUcsSUFBSSxZQUFZLEVBQWlCLENBQUM7UUFDbkQsbUJBQWMsR0FBRyxJQUFJLFlBQVksQ0FBUyxJQUFJLENBQUMsQ0FBQztRQUVuRCxVQUFLLEdBQWUsRUFBRSxDQUFDO1FBQ3ZCLHFCQUFnQixHQUFHLENBQUMsQ0FBQztRQUNyQixjQUFTLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsU0FBSSxHQUFpQixLQUFLLENBQUM7UUFHMUIsV0FBTSxHQUFHLEtBQUssQ0FBQztRQUNmLG1CQUFjLEdBQUcsSUFBSSxDQUFDO0lBMUM5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dUxUO1FBbUxELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2lCQWxMNUI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztLQWlMUjtLQUVKLENBQUM7R0FDVyxnQkFBZ0IsQ0FzakI1QjtTQXRqQlksZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtEYXRlUGlwZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7SW9uU2xpZGVzfSBmcm9tICdAaW9uaWMvYW5ndWxhcic7XG5pbXBvcnQge1xuICAgIENvbXBvbmVudCxcbiAgICBPbkluaXQsXG4gICAgT25DaGFuZ2VzLFxuICAgIEhvc3RCaW5kaW5nLFxuICAgIElucHV0LFxuICAgIE91dHB1dCxcbiAgICBFdmVudEVtaXR0ZXIsXG4gICAgU2ltcGxlQ2hhbmdlcyxcbiAgICBWaWV3Q2hpbGQsXG4gICAgVmlld0VuY2Fwc3VsYXRpb24sXG4gICAgVGVtcGxhdGVSZWYsXG4gICAgRWxlbWVudFJlZixcbiAgICBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3lcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1N1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7XG4gICAgSUNhbGVuZGFyQ29tcG9uZW50LFxuICAgIElEYXlWaWV3LFxuICAgIElEYXlWaWV3Um93LFxuICAgIElEaXNwbGF5RXZlbnQsXG4gICAgSUV2ZW50LFxuICAgIElUaW1lU2VsZWN0ZWQsXG4gICAgSVJhbmdlLFxuICAgIENhbGVuZGFyTW9kZSxcbiAgICBJRGF0ZUZvcm1hdHRlclxufSBmcm9tICcuL2NhbGVuZGFyJztcbmltcG9ydCB7Q2FsZW5kYXJTZXJ2aWNlfSBmcm9tICcuL2NhbGVuZGFyLnNlcnZpY2UnO1xuaW1wb3J0IHtJRGlzcGxheUFsbERheUV2ZW50LCBJRGF5Vmlld0FsbERheUV2ZW50U2VjdGlvblRlbXBsYXRlQ29udGV4dCwgSURheVZpZXdOb3JtYWxFdmVudFNlY3Rpb25UZW1wbGF0ZUNvbnRleHR9IGZyb20gJy4vY2FsZW5kYXInO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2RheXZpZXcnLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxpb24tc2xpZGVzICNkYXlTbGlkZXIgW29wdGlvbnNdPVwic2xpZGVyT3B0aW9uc1wiIFtkaXJdPVwiZGlyXCIgKGlvblNsaWRlRGlkQ2hhbmdlKT1cIm9uU2xpZGVDaGFuZ2VkKClcIiBjbGFzcz1cInNsaWRlcy1jb250YWluZXJcIj5cbiAgICAgICAgICAgIDxpb24tc2xpZGUgY2xhc3M9XCJzbGlkZS1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGF5dmlldy1hbGxkYXktdGFibGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRheXZpZXctYWxsZGF5LWxhYmVsXCI+e3thbGxEYXlMYWJlbH19PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkYXl2aWV3LWFsbGRheS1jb250ZW50LXdyYXBwZXIgc2Nyb2xsLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzcz1cInRhYmxlIHRhYmxlLWJvcmRlcmVkIGRheXZpZXctYWxsZGF5LWNvbnRlbnQtdGFibGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjYWxlbmRhci1jZWxsXCIgW25nQ2xhc3NdPVwieydjYWxlbmRhci1ldmVudC13cmFwJzp2aWV3c1swXS5hbGxEYXlFdmVudHMubGVuZ3RoPjB9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtuZ1N0eWxlXT1cIntoZWlnaHQ6IDI1KnZpZXdzWzBdLmFsbERheUV2ZW50cy5sZW5ndGgrJ3B4J31cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKm5nSWY9XCIwPT09Y3VycmVudFZpZXdJbmRleFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImRheXZpZXdBbGxEYXlFdmVudFNlY3Rpb25UZW1wbGF0ZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInthbGxEYXlFdmVudHM6dmlld3NbMF0uYWxsRGF5RXZlbnRzLGV2ZW50VGVtcGxhdGU6ZGF5dmlld0FsbERheUV2ZW50VGVtcGxhdGV9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjYWxlbmRhci1jZWxsXCIgKm5nSWY9XCIwIT09Y3VycmVudFZpZXdJbmRleFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImRheXZpZXdJbmFjdGl2ZUFsbERheUV2ZW50U2VjdGlvblRlbXBsYXRlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwie2FsbERheUV2ZW50czp2aWV3c1swXS5hbGxEYXlFdmVudHN9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxpbml0LXBvc2l0aW9uLXNjcm9sbCAqbmdJZj1cIjA9PT1jdXJyZW50Vmlld0luZGV4XCIgY2xhc3M9XCJkYXl2aWV3LW5vcm1hbC1ldmVudC1jb250YWluZXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbaW5pdFBvc2l0aW9uXT1cImluaXRTY3JvbGxQb3NpdGlvblwiIFtlbWl0RXZlbnRdPVwicHJlc2VydmVTY3JvbGxQb3NpdGlvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChvblNjcm9sbCk9XCJzZXRTY3JvbGxQb3NpdGlvbigkZXZlbnQpXCI+XG4gICAgICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzcz1cInRhYmxlIHRhYmxlLWJvcmRlcmVkIHRhYmxlLWZpeGVkIGRheXZpZXctbm9ybWFsLWV2ZW50LXRhYmxlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dHIgKm5nRm9yPVwibGV0IHRtIG9mIHZpZXdzWzBdLnJvd3M7IGxldCBpID0gaW5kZXhcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjYWxlbmRhci1ob3VyLWNvbHVtbiB0ZXh0LWNlbnRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7e2hvdXJDb2x1bW5MYWJlbHNbaV19fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwiY2FsZW5kYXItY2VsbFwiIHRhcHBhYmxlIChjbGljayk9XCJzZWxlY3QodG0udGltZSwgdG0uZXZlbnRzKVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwiZGF5dmlld05vcm1hbEV2ZW50U2VjdGlvblRlbXBsYXRlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7dG06dG0sIGhvdXJQYXJ0czogaG91clBhcnRzLCBldmVudFRlbXBsYXRlOmRheXZpZXdOb3JtYWxFdmVudFRlbXBsYXRlfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgICAgICA8L2luaXQtcG9zaXRpb24tc2Nyb2xsPlxuICAgICAgICAgICAgICAgIDxpbml0LXBvc2l0aW9uLXNjcm9sbCAqbmdJZj1cIjAhPT1jdXJyZW50Vmlld0luZGV4XCIgY2xhc3M9XCJkYXl2aWV3LW5vcm1hbC1ldmVudC1jb250YWluZXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbaW5pdFBvc2l0aW9uXT1cImluaXRTY3JvbGxQb3NpdGlvblwiPlxuICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3M9XCJ0YWJsZSB0YWJsZS1ib3JkZXJlZCB0YWJsZS1maXhlZCBkYXl2aWV3LW5vcm1hbC1ldmVudC10YWJsZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyICpuZ0Zvcj1cImxldCB0bSBvZiB2aWV3c1swXS5yb3dzOyBsZXQgaSA9IGluZGV4XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwiY2FsZW5kYXItaG91ci1jb2x1bW4gdGV4dC1jZW50ZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3tob3VyQ29sdW1uTGFiZWxzW2ldfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cImNhbGVuZGFyLWNlbGxcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImRheXZpZXdJbmFjdGl2ZU5vcm1hbEV2ZW50U2VjdGlvblRlbXBsYXRlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7dG06dG0sIGhvdXJQYXJ0czogaG91clBhcnRzfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgICAgICA8L2luaXQtcG9zaXRpb24tc2Nyb2xsPlxuICAgICAgICAgICAgPC9pb24tc2xpZGU+XG4gICAgICAgICAgICA8aW9uLXNsaWRlIGNsYXNzPVwic2xpZGUtY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRheXZpZXctYWxsZGF5LXRhYmxlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkYXl2aWV3LWFsbGRheS1sYWJlbFwiPnt7YWxsRGF5TGFiZWx9fTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGF5dmlldy1hbGxkYXktY29udGVudC13cmFwcGVyIHNjcm9sbC1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3M9XCJ0YWJsZSB0YWJsZS1ib3JkZXJlZCBkYXl2aWV3LWFsbGRheS1jb250ZW50LXRhYmxlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwiY2FsZW5kYXItY2VsbFwiIFtuZ0NsYXNzXT1cInsnY2FsZW5kYXItZXZlbnQtd3JhcCc6dmlld3NbMV0uYWxsRGF5RXZlbnRzLmxlbmd0aD4wfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbbmdTdHlsZV09XCJ7aGVpZ2h0OiAyNSp2aWV3c1sxXS5hbGxEYXlFdmVudHMubGVuZ3RoKydweCd9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpuZ0lmPVwiMT09PWN1cnJlbnRWaWV3SW5kZXhcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSBbbmdUZW1wbGF0ZU91dGxldF09XCJkYXl2aWV3QWxsRGF5RXZlbnRTZWN0aW9uVGVtcGxhdGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7YWxsRGF5RXZlbnRzOnZpZXdzWzFdLmFsbERheUV2ZW50cyxldmVudFRlbXBsYXRlOmRheXZpZXdBbGxEYXlFdmVudFRlbXBsYXRlfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwiY2FsZW5kYXItY2VsbFwiICpuZ0lmPVwiMSE9PWN1cnJlbnRWaWV3SW5kZXhcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSBbbmdUZW1wbGF0ZU91dGxldF09XCJkYXl2aWV3SW5hY3RpdmVBbGxEYXlFdmVudFNlY3Rpb25UZW1wbGF0ZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInthbGxEYXlFdmVudHM6dmlld3NbMV0uYWxsRGF5RXZlbnRzfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8aW5pdC1wb3NpdGlvbi1zY3JvbGwgKm5nSWY9XCIxPT09Y3VycmVudFZpZXdJbmRleFwiIGNsYXNzPVwiZGF5dmlldy1ub3JtYWwtZXZlbnQtY29udGFpbmVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW2luaXRQb3NpdGlvbl09XCJpbml0U2Nyb2xsUG9zaXRpb25cIiBbZW1pdEV2ZW50XT1cInByZXNlcnZlU2Nyb2xsUG9zaXRpb25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAob25TY3JvbGwpPVwic2V0U2Nyb2xsUG9zaXRpb24oJGV2ZW50KVwiPlxuICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3M9XCJ0YWJsZSB0YWJsZS1ib3JkZXJlZCB0YWJsZS1maXhlZCBkYXl2aWV3LW5vcm1hbC1ldmVudC10YWJsZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyICpuZ0Zvcj1cImxldCB0bSBvZiB2aWV3c1sxXS5yb3dzOyBsZXQgaSA9IGluZGV4XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwiY2FsZW5kYXItaG91ci1jb2x1bW4gdGV4dC1jZW50ZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3tob3VyQ29sdW1uTGFiZWxzW2ldfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cImNhbGVuZGFyLWNlbGxcIiB0YXBwYWJsZSAoY2xpY2spPVwic2VsZWN0KHRtLnRpbWUsIHRtLmV2ZW50cylcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImRheXZpZXdOb3JtYWxFdmVudFNlY3Rpb25UZW1wbGF0ZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwie3RtOnRtLCBob3VyUGFydHM6IGhvdXJQYXJ0cywgZXZlbnRUZW1wbGF0ZTpkYXl2aWV3Tm9ybWFsRXZlbnRUZW1wbGF0ZX1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgICAgICAgPC9pbml0LXBvc2l0aW9uLXNjcm9sbD5cbiAgICAgICAgICAgICAgICA8aW5pdC1wb3NpdGlvbi1zY3JvbGwgKm5nSWY9XCIxIT09Y3VycmVudFZpZXdJbmRleFwiIGNsYXNzPVwiZGF5dmlldy1ub3JtYWwtZXZlbnQtY29udGFpbmVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW2luaXRQb3NpdGlvbl09XCJpbml0U2Nyb2xsUG9zaXRpb25cIj5cbiAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzPVwidGFibGUgdGFibGUtYm9yZGVyZWQgdGFibGUtZml4ZWQgZGF5dmlldy1ub3JtYWwtZXZlbnQtdGFibGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ciAqbmdGb3I9XCJsZXQgdG0gb2Ygdmlld3NbMV0ucm93czsgbGV0IGkgPSBpbmRleFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cImNhbGVuZGFyLWhvdXItY29sdW1uIHRleHQtY2VudGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt7aG91ckNvbHVtbkxhYmVsc1tpXX19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjYWxlbmRhci1jZWxsXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSBbbmdUZW1wbGF0ZU91dGxldF09XCJkYXl2aWV3SW5hY3RpdmVOb3JtYWxFdmVudFNlY3Rpb25UZW1wbGF0ZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwie3RtOnRtLCBob3VyUGFydHM6IGhvdXJQYXJ0c31cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgICAgICAgPC9pbml0LXBvc2l0aW9uLXNjcm9sbD5cbiAgICAgICAgICAgIDwvaW9uLXNsaWRlPlxuICAgICAgICAgICAgPGlvbi1zbGlkZSBjbGFzcz1cInNsaWRlLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkYXl2aWV3LWFsbGRheS10YWJsZVwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGF5dmlldy1hbGxkYXktbGFiZWxcIj57e2FsbERheUxhYmVsfX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRheXZpZXctYWxsZGF5LWNvbnRlbnQtd3JhcHBlciBzY3JvbGwtY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzPVwidGFibGUgdGFibGUtYm9yZGVyZWQgZGF5dmlldy1hbGxkYXktY29udGVudC10YWJsZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cImNhbGVuZGFyLWNlbGxcIiBbbmdDbGFzc109XCJ7J2NhbGVuZGFyLWV2ZW50LXdyYXAnOnZpZXdzWzJdLmFsbERheUV2ZW50cy5sZW5ndGg+MH1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW25nU3R5bGVdPVwie2hlaWdodDogMjUqdmlld3NbMl0uYWxsRGF5RXZlbnRzLmxlbmd0aCsncHgnfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqbmdJZj1cIjI9PT1jdXJyZW50Vmlld0luZGV4XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwiZGF5dmlld0FsbERheUV2ZW50U2VjdGlvblRlbXBsYXRlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwie2FsbERheUV2ZW50czp2aWV3c1syXS5hbGxEYXlFdmVudHMsZXZlbnRUZW1wbGF0ZTpkYXl2aWV3QWxsRGF5RXZlbnRUZW1wbGF0ZX1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cImNhbGVuZGFyLWNlbGxcIiAqbmdJZj1cIjIhPT1jdXJyZW50Vmlld0luZGV4XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwiZGF5dmlld0luYWN0aXZlQWxsRGF5RXZlbnRTZWN0aW9uVGVtcGxhdGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7YWxsRGF5RXZlbnRzOnZpZXdzWzJdLmFsbERheUV2ZW50c31cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGluaXQtcG9zaXRpb24tc2Nyb2xsICpuZ0lmPVwiMj09PWN1cnJlbnRWaWV3SW5kZXhcIiBjbGFzcz1cImRheXZpZXctbm9ybWFsLWV2ZW50LWNvbnRhaW5lclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtpbml0UG9zaXRpb25dPVwiaW5pdFNjcm9sbFBvc2l0aW9uXCIgW2VtaXRFdmVudF09XCJwcmVzZXJ2ZVNjcm9sbFBvc2l0aW9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG9uU2Nyb2xsKT1cInNldFNjcm9sbFBvc2l0aW9uKCRldmVudClcIj5cbiAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzPVwidGFibGUgdGFibGUtYm9yZGVyZWQgdGFibGUtZml4ZWQgZGF5dmlldy1ub3JtYWwtZXZlbnQtdGFibGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ciAqbmdGb3I9XCJsZXQgdG0gb2Ygdmlld3NbMl0ucm93czsgbGV0IGkgPSBpbmRleFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cImNhbGVuZGFyLWhvdXItY29sdW1uIHRleHQtY2VudGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt7aG91ckNvbHVtbkxhYmVsc1tpXX19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjYWxlbmRhci1jZWxsXCIgdGFwcGFibGUgKGNsaWNrKT1cInNlbGVjdCh0bS50aW1lLCB0bS5ldmVudHMpXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSBbbmdUZW1wbGF0ZU91dGxldF09XCJkYXl2aWV3Tm9ybWFsRXZlbnRTZWN0aW9uVGVtcGxhdGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInt0bTp0bSwgaG91clBhcnRzOiBob3VyUGFydHMsIGV2ZW50VGVtcGxhdGU6ZGF5dmlld05vcm1hbEV2ZW50VGVtcGxhdGV9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICAgICAgICAgIDwvaW5pdC1wb3NpdGlvbi1zY3JvbGw+XG4gICAgICAgICAgICAgICAgPGluaXQtcG9zaXRpb24tc2Nyb2xsICpuZ0lmPVwiMiE9PWN1cnJlbnRWaWV3SW5kZXhcIiBjbGFzcz1cImRheXZpZXctbm9ybWFsLWV2ZW50LWNvbnRhaW5lclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtpbml0UG9zaXRpb25dPVwiaW5pdFNjcm9sbFBvc2l0aW9uXCI+XG4gICAgICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzcz1cInRhYmxlIHRhYmxlLWJvcmRlcmVkIHRhYmxlLWZpeGVkIGRheXZpZXctbm9ybWFsLWV2ZW50LXRhYmxlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dHIgKm5nRm9yPVwibGV0IHRtIG9mIHZpZXdzWzJdLnJvd3M7IGxldCBpID0gaW5kZXhcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJjYWxlbmRhci1ob3VyLWNvbHVtbiB0ZXh0LWNlbnRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7e2hvdXJDb2x1bW5MYWJlbHNbaV19fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwiY2FsZW5kYXItY2VsbFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwiZGF5dmlld0luYWN0aXZlTm9ybWFsRXZlbnRTZWN0aW9uVGVtcGxhdGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInt0bTp0bSwgaG91clBhcnRzOiBob3VyUGFydHN9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICAgICAgICAgIDwvaW5pdC1wb3NpdGlvbi1zY3JvbGw+XG4gICAgICAgICAgICA8L2lvbi1zbGlkZT5cbiAgICAgICAgPC9pb24tc2xpZGVzPlxuICAgIGAsXG4gICAgc3R5bGVzOiBbYFxuICAgICAgICAudGFibGUtZml4ZWQge1xuICAgICAgICAgICAgdGFibGUtbGF5b3V0OiBmaXhlZDtcbiAgICAgICAgfVxuXG4gICAgICAgIC50YWJsZSB7XG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgIG1heC13aWR0aDogMTAwJTtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgLnRhYmxlID4gdGhlYWQgPiB0ciA+IHRoLCAudGFibGUgPiB0Ym9keSA+IHRyID4gdGgsIC50YWJsZSA+IHRmb290ID4gdHIgPiB0aCwgLnRhYmxlID4gdGhlYWQgPiB0ciA+IHRkLFxuICAgICAgICAudGFibGUgPiB0Ym9keSA+IHRyID4gdGQsIC50YWJsZSA+IHRmb290ID4gdHIgPiB0ZCB7XG4gICAgICAgICAgICBwYWRkaW5nOiA4cHg7XG4gICAgICAgICAgICBsaW5lLWhlaWdodDogMjBweDtcbiAgICAgICAgICAgIHZlcnRpY2FsLWFsaWduOiB0b3A7XG4gICAgICAgIH1cblxuICAgICAgICAudGFibGUgPiB0aGVhZCA+IHRyID4gdGgge1xuICAgICAgICAgICAgdmVydGljYWwtYWxpZ246IGJvdHRvbTtcbiAgICAgICAgICAgIGJvcmRlci1ib3R0b206IDJweCBzb2xpZCAjZGRkO1xuICAgICAgICB9XG5cbiAgICAgICAgLnRhYmxlID4gdGhlYWQ6Zmlyc3QtY2hpbGQgPiB0cjpmaXJzdC1jaGlsZCA+IHRoLCAudGFibGUgPiB0aGVhZDpmaXJzdC1jaGlsZCA+IHRyOmZpcnN0LWNoaWxkID4gdGQge1xuICAgICAgICAgICAgYm9yZGVyLXRvcDogMFxuICAgICAgICB9XG5cbiAgICAgICAgLnRhYmxlID4gdGJvZHkgKyB0Ym9keSB7XG4gICAgICAgICAgICBib3JkZXItdG9wOiAycHggc29saWQgI2RkZDtcbiAgICAgICAgfVxuXG4gICAgICAgIC50YWJsZS1ib3JkZXJlZCB7XG4gICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAjZGRkO1xuICAgICAgICB9XG5cbiAgICAgICAgLnRhYmxlLWJvcmRlcmVkID4gdGhlYWQgPiB0ciA+IHRoLCAudGFibGUtYm9yZGVyZWQgPiB0Ym9keSA+IHRyID4gdGgsIC50YWJsZS1ib3JkZXJlZCA+IHRmb290ID4gdHIgPiB0aCxcbiAgICAgICAgLnRhYmxlLWJvcmRlcmVkID4gdGhlYWQgPiB0ciA+IHRkLCAudGFibGUtYm9yZGVyZWQgPiB0Ym9keSA+IHRyID4gdGQsIC50YWJsZS1ib3JkZXJlZCA+IHRmb290ID4gdHIgPiB0ZCB7XG4gICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAjZGRkO1xuICAgICAgICB9XG5cbiAgICAgICAgLnRhYmxlLWJvcmRlcmVkID4gdGhlYWQgPiB0ciA+IHRoLCAudGFibGUtYm9yZGVyZWQgPiB0aGVhZCA+IHRyID4gdGQge1xuICAgICAgICAgICAgYm9yZGVyLWJvdHRvbS13aWR0aDogMnB4O1xuICAgICAgICB9XG5cbiAgICAgICAgLnRhYmxlLXN0cmlwZWQgPiB0Ym9keSA+IHRyOm50aC1jaGlsZChvZGQpID4gdGQsIC50YWJsZS1zdHJpcGVkID4gdGJvZHkgPiB0cjpudGgtY2hpbGQob2RkKSA+IHRoIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmOWY5ZjlcbiAgICAgICAgfVxuXG4gICAgICAgIC5jYWxlbmRhci1ob3VyLWNvbHVtbiB7XG4gICAgICAgICAgICB3aWR0aDogNTBweDtcbiAgICAgICAgICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gICAgICAgIH1cblxuICAgICAgICAuY2FsZW5kYXItZXZlbnQtd3JhcCB7XG4gICAgICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgIGhlaWdodDogMTAwJTtcbiAgICAgICAgfVxuXG4gICAgICAgIC5jYWxlbmRhci1ldmVudCB7XG4gICAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgICAgICBwYWRkaW5nOiAycHg7XG4gICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgICAgICB6LWluZGV4OiAxMDAwMDtcbiAgICAgICAgfVxuXG4gICAgICAgIC5zbGlkZXMtY29udGFpbmVyIHtcbiAgICAgICAgICAgIGhlaWdodDogMTAwJTtcbiAgICAgICAgfVxuXG4gICAgICAgIC5zbGlkZS1jb250YWluZXIge1xuICAgICAgICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICAgIH1cblxuICAgICAgICAuY2FsZW5kYXItY2VsbCB7XG4gICAgICAgICAgICBwYWRkaW5nOiAwICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBoZWlnaHQ6IDM3cHg7XG4gICAgICAgIH1cblxuICAgICAgICAuZGF5dmlldy1hbGxkYXktbGFiZWwge1xuICAgICAgICAgICAgZmxvYXQ6IGxlZnQ7XG4gICAgICAgICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICAgICAgICBsaW5lLWhlaWdodDogNTBweDtcbiAgICAgICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAgICAgIHdpZHRoOiA1MHB4O1xuICAgICAgICAgICAgYm9yZGVyLWxlZnQ6IDFweCBzb2xpZCAjZGRkO1xuICAgICAgICB9XG5cbiAgICAgICAgW2Rpcj1cInJ0bFwiXSAuZGF5dmlldy1hbGxkYXktbGFiZWwge1xuICAgICAgICAgICAgYm9yZGVyLXJpZ2h0OiAxcHggc29saWQgI2RkZDtcbiAgICAgICAgICAgIGZsb2F0OiByaWdodDtcbiAgICAgICAgfVxuXG4gICAgICAgIC5kYXl2aWV3LWFsbGRheS1jb250ZW50LXdyYXBwZXIge1xuICAgICAgICAgICAgbWFyZ2luLWxlZnQ6IDUwcHg7XG4gICAgICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgICAgICAgICAgaGVpZ2h0OiA1MXB4O1xuICAgICAgICB9XG5cbiAgICAgICAgW2Rpcj1cInJ0bFwiXSAuZGF5dmlldy1hbGxkYXktY29udGVudC13cmFwcGVyIHtcbiAgICAgICAgICAgIG1hcmdpbi1sZWZ0OiAwO1xuICAgICAgICAgICAgbWFyZ2luLXJpZ2h0OiA1MHB4O1xuICAgICAgICB9XG5cbiAgICAgICAgLmRheXZpZXctYWxsZGF5LWNvbnRlbnQtdGFibGUge1xuICAgICAgICAgICAgbWluLWhlaWdodDogNTBweDtcbiAgICAgICAgfVxuXG4gICAgICAgIC5kYXl2aWV3LWFsbGRheS1jb250ZW50LXRhYmxlIHRkIHtcbiAgICAgICAgICAgIGJvcmRlci1sZWZ0OiAxcHggc29saWQgI2RkZDtcbiAgICAgICAgICAgIGJvcmRlci1yaWdodDogMXB4IHNvbGlkICNkZGQ7XG4gICAgICAgIH1cblxuICAgICAgICAuZGF5dmlldy1hbGxkYXktdGFibGUge1xuICAgICAgICAgICAgaGVpZ2h0OiA1MHB4O1xuICAgICAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgICAgICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNkZGQ7XG4gICAgICAgICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICAgIH1cblxuICAgICAgICAuZGF5dmlldy1ub3JtYWwtZXZlbnQtY29udGFpbmVyIHtcbiAgICAgICAgICAgIG1hcmdpbi10b3A6IDUwcHg7XG4gICAgICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgICAgICAgICAgbGVmdDogMDtcbiAgICAgICAgICAgIHJpZ2h0OiAwO1xuICAgICAgICAgICAgdG9wOiAwO1xuICAgICAgICAgICAgYm90dG9tOiAwO1xuICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgICB9XG5cbiAgICAgICAgLnNjcm9sbC1jb250ZW50IHtcbiAgICAgICAgICAgIG92ZXJmbG93LXk6IGF1dG87XG4gICAgICAgICAgICBvdmVyZmxvdy14OiBoaWRkZW47XG4gICAgICAgIH1cblxuICAgICAgICA6Oi13ZWJraXQtc2Nyb2xsYmFyLFxuICAgICAgICAqOjotd2Via2l0LXNjcm9sbGJhciB7XG4gICAgICAgICAgICBkaXNwbGF5OiBub25lO1xuICAgICAgICB9XG5cbiAgICAgICAgLnRhYmxlID4gdGJvZHkgPiB0ciA+IHRkLmNhbGVuZGFyLWhvdXItY29sdW1uIHtcbiAgICAgICAgICAgIHBhZGRpbmctbGVmdDogMDtcbiAgICAgICAgICAgIHBhZGRpbmctcmlnaHQ6IDA7XG4gICAgICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuICAgICAgICB9XG5cbiAgICAgICAgQG1lZGlhIChtYXgtd2lkdGg6IDc1MHB4KSB7XG4gICAgICAgICAgICAuZGF5dmlldy1hbGxkYXktbGFiZWwsIC5jYWxlbmRhci1ob3VyLWNvbHVtbiB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDMxcHg7XG4gICAgICAgICAgICAgICAgZm9udC1zaXplOiAxMnB4O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAuZGF5dmlldy1hbGxkYXktbGFiZWwge1xuICAgICAgICAgICAgICAgIHBhZGRpbmctdG9wOiA0cHg7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC50YWJsZSA+IHRib2R5ID4gdHIgPiB0ZC5jYWxlbmRhci1ob3VyLWNvbHVtbiB7XG4gICAgICAgICAgICAgICAgcGFkZGluZy1sZWZ0OiAwO1xuICAgICAgICAgICAgICAgIHBhZGRpbmctcmlnaHQ6IDA7XG4gICAgICAgICAgICAgICAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgICAgICAgICAgICAgICBsaW5lLWhlaWdodDogMTJweDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLmRheXZpZXctYWxsZGF5LWxhYmVsIHtcbiAgICAgICAgICAgICAgICBsaW5lLWhlaWdodDogMjBweDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLmRheXZpZXctYWxsZGF5LWNvbnRlbnQtd3JhcHBlciB7XG4gICAgICAgICAgICAgICAgbWFyZ2luLWxlZnQ6IDMxcHg7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIFtkaXI9XCJydGxcIl0gLmRheXZpZXctYWxsZGF5LWNvbnRlbnQtd3JhcHBlciB7XG4gICAgICAgICAgICAgICAgbWFyZ2luLWxlZnQ6IDA7XG4gICAgICAgICAgICAgICAgbWFyZ2luLXJpZ2h0OiAzMXB4O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgYF0sXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxufSlcbmV4cG9ydCBjbGFzcyBEYXlWaWV3Q29tcG9uZW50IGltcGxlbWVudHMgSUNhbGVuZGFyQ29tcG9uZW50LCBPbkluaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95LCBBZnRlclZpZXdJbml0IHtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgY2FsZW5kYXJTZXJ2aWNlOiBDYWxlbmRhclNlcnZpY2UsIHByaXZhdGUgZWxtOiBFbGVtZW50UmVmKSB7XG4gICAgfVxuXG4gICAgQFZpZXdDaGlsZCgnZGF5U2xpZGVyJywge3N0YXRpYzogdHJ1ZX0pIHNsaWRlcjogSW9uU2xpZGVzO1xuICAgIEBIb3N0QmluZGluZygnY2xhc3MuZGF5dmlldycpIGNsYXNzID0gdHJ1ZTtcblxuICAgIEBJbnB1dCgpIGRheXZpZXdBbGxEYXlFdmVudFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxJRGlzcGxheUFsbERheUV2ZW50PjtcbiAgICBASW5wdXQoKSBkYXl2aWV3Tm9ybWFsRXZlbnRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8SURpc3BsYXlFdmVudD47XG4gICAgQElucHV0KCkgZGF5dmlld0FsbERheUV2ZW50U2VjdGlvblRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxJRGF5Vmlld0FsbERheUV2ZW50U2VjdGlvblRlbXBsYXRlQ29udGV4dD47XG4gICAgQElucHV0KCkgZGF5dmlld05vcm1hbEV2ZW50U2VjdGlvblRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxJRGF5Vmlld05vcm1hbEV2ZW50U2VjdGlvblRlbXBsYXRlQ29udGV4dD47XG4gICAgQElucHV0KCkgZGF5dmlld0luYWN0aXZlQWxsRGF5RXZlbnRTZWN0aW9uVGVtcGxhdGU6IFRlbXBsYXRlUmVmPElEYXlWaWV3QWxsRGF5RXZlbnRTZWN0aW9uVGVtcGxhdGVDb250ZXh0PjtcbiAgICBASW5wdXQoKSBkYXl2aWV3SW5hY3RpdmVOb3JtYWxFdmVudFNlY3Rpb25UZW1wbGF0ZTogVGVtcGxhdGVSZWY8SURheVZpZXdOb3JtYWxFdmVudFNlY3Rpb25UZW1wbGF0ZUNvbnRleHQ+O1xuXG4gICAgQElucHV0KCkgZm9ybWF0SG91ckNvbHVtbjogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGZvcm1hdERheVRpdGxlOiBzdHJpbmc7XG4gICAgQElucHV0KCkgYWxsRGF5TGFiZWw6IHN0cmluZztcbiAgICBASW5wdXQoKSBob3VyUGFydHM6IG51bWJlcjtcbiAgICBASW5wdXQoKSBldmVudFNvdXJjZTogSUV2ZW50W107XG4gICAgQElucHV0KCkgbWFya0Rpc2FibGVkOiAoZGF0ZTogRGF0ZSkgPT4gYm9vbGVhbjtcbiAgICBASW5wdXQoKSBsb2NhbGU6IHN0cmluZztcbiAgICBASW5wdXQoKSBkYXRlRm9ybWF0dGVyOiBJRGF0ZUZvcm1hdHRlcjtcbiAgICBASW5wdXQoKSBkaXIgPSAnJztcbiAgICBASW5wdXQoKSBzY3JvbGxUb0hvdXIgPSAwO1xuICAgIEBJbnB1dCgpIHByZXNlcnZlU2Nyb2xsUG9zaXRpb246IGJvb2xlYW47XG4gICAgQElucHV0KCkgbG9ja1N3aXBlVG9QcmV2OiBib29sZWFuO1xuICAgIEBJbnB1dCgpIGxvY2tTd2lwZXM6IGJvb2xlYW47XG4gICAgQElucHV0KCkgc3RhcnRIb3VyOiBudW1iZXI7XG4gICAgQElucHV0KCkgZW5kSG91cjogbnVtYmVyO1xuICAgIEBJbnB1dCgpIHNsaWRlck9wdGlvbnM6IGFueTtcbiAgICBASW5wdXQoKSBob3VyU2VnbWVudHM6IG51bWJlcjtcblxuICAgIEBPdXRwdXQoKSBvblJhbmdlQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8SVJhbmdlPigpO1xuICAgIEBPdXRwdXQoKSBvbkV2ZW50U2VsZWN0ZWQgPSBuZXcgRXZlbnRFbWl0dGVyPElFdmVudD4oKTtcbiAgICBAT3V0cHV0KCkgb25UaW1lU2VsZWN0ZWQgPSBuZXcgRXZlbnRFbWl0dGVyPElUaW1lU2VsZWN0ZWQ+KCk7XG4gICAgQE91dHB1dCgpIG9uVGl0bGVDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KHRydWUpO1xuXG4gICAgcHVibGljIHZpZXdzOiBJRGF5Vmlld1tdID0gW107XG4gICAgcHVibGljIGN1cnJlbnRWaWV3SW5kZXggPSAwO1xuICAgIHB1YmxpYyBkaXJlY3Rpb24gPSAwO1xuICAgIHB1YmxpYyBtb2RlOiBDYWxlbmRhck1vZGUgPSAnZGF5JztcbiAgICBwdWJsaWMgcmFuZ2U6IElSYW5nZTtcblxuICAgIHByaXZhdGUgaW5pdGVkID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBjYWxsYmFja09uSW5pdCA9IHRydWU7XG4gICAgcHJpdmF0ZSBjdXJyZW50RGF0ZUNoYW5nZWRGcm9tUGFyZW50U3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gICAgcHJpdmF0ZSBldmVudFNvdXJjZUNoYW5nZWRTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgICBwcml2YXRlIHNsaWRlQ2hhbmdlZFN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICAgIHByaXZhdGUgc2xpZGVVcGRhdGVkU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgICBwdWJsaWMgaG91ckNvbHVtbkxhYmVsczogc3RyaW5nW107XG4gICAgcHVibGljIGluaXRTY3JvbGxQb3NpdGlvbjogbnVtYmVyO1xuICAgIHByaXZhdGUgZm9ybWF0VGl0bGU6IChkYXRlOiBEYXRlKSA9PiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBmb3JtYXRIb3VyQ29sdW1uTGFiZWw6IChkYXRlOiBEYXRlKSA9PiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBob3VyUmFuZ2U6IG51bWJlcjtcblxuICAgIHN0YXRpYyBjcmVhdGVEYXRlT2JqZWN0cyhzdGFydFRpbWU6IERhdGUsIHN0YXJ0SG91cjogbnVtYmVyLCBlbmRIb3VyOiBudW1iZXIsIHRpbWVJbnRlcnZhbDogbnVtYmVyKTogSURheVZpZXdSb3dbXSB7XG4gICAgICAgIGNvbnN0IHJvd3M6IElEYXlWaWV3Um93W10gPSBbXSxcbiAgICAgICAgICAgIGN1cnJlbnRIb3VyID0gMCxcbiAgICAgICAgICAgIGN1cnJlbnREYXRlID0gc3RhcnRUaW1lLmdldERhdGUoKTtcbiAgICAgICAgbGV0IHRpbWU6IERhdGUsXG4gICAgICAgICAgICBob3VyU3RlcCxcbiAgICAgICAgICAgIG1pblN0ZXA7XG5cbiAgICAgICAgaWYgKHRpbWVJbnRlcnZhbCA8IDEpIHtcbiAgICAgICAgICAgIGhvdXJTdGVwID0gTWF0aC5mbG9vcigxIC8gdGltZUludGVydmFsKTtcbiAgICAgICAgICAgIG1pblN0ZXAgPSA2MDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGhvdXJTdGVwID0gMTtcbiAgICAgICAgICAgIG1pblN0ZXAgPSBNYXRoLmZsb29yKDYwIC8gdGltZUludGVydmFsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGhvdXIgPSBzdGFydEhvdXI7IGhvdXIgPCBlbmRIb3VyOyBob3VyICs9IGhvdXJTdGVwKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpbnRlcnZhbCA9IDA7IGludGVydmFsIDwgNjA7IGludGVydmFsICs9IG1pblN0ZXApIHtcbiAgICAgICAgICAgICAgICB0aW1lID0gbmV3IERhdGUoc3RhcnRUaW1lLmdldFRpbWUoKSk7XG4gICAgICAgICAgICAgICAgdGltZS5zZXRIb3VycyhjdXJyZW50SG91ciArIGhvdXIsIGludGVydmFsKTtcbiAgICAgICAgICAgICAgICB0aW1lLnNldERhdGUoY3VycmVudERhdGUpO1xuICAgICAgICAgICAgICAgIHJvd3MucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHRpbWUsXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50czogW11cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcm93cztcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBjb21wYXJlRXZlbnRCeVN0YXJ0T2Zmc2V0KGV2ZW50QTogSURpc3BsYXlFdmVudCwgZXZlbnRCOiBJRGlzcGxheUV2ZW50KSB7XG4gICAgICAgIHJldHVybiBldmVudEEuc3RhcnRPZmZzZXQgLSBldmVudEIuc3RhcnRPZmZzZXQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgY2FsY3VsYXRlV2lkdGgob3JkZXJlZEV2ZW50czogSURpc3BsYXlFdmVudFtdLCBzaXplOiBudW1iZXIsIGhvdXJQYXJ0czogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IHRvdGFsU2l6ZSA9IHNpemUgKiBob3VyUGFydHMsXG4gICAgICAgICAgICBjZWxsczogeyBjYWxjdWxhdGVkOiBib29sZWFuOyBldmVudHM6IElEaXNwbGF5RXZlbnRbXTsgfVtdID0gbmV3IEFycmF5KHRvdGFsU2l6ZSk7XG5cbiAgICAgICAgLy8gc29ydCBieSBwb3NpdGlvbiBpbiBkZXNjZW5kaW5nIG9yZGVyLCB0aGUgcmlnaHQgbW9zdCBjb2x1bW5zIHNob3VsZCBiZSBjYWxjdWxhdGVkIGZpcnN0XG4gICAgICAgIG9yZGVyZWRFdmVudHMuc29ydCgoZXZlbnRBLCBldmVudEIpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBldmVudEIucG9zaXRpb24gLSBldmVudEEucG9zaXRpb247XG4gICAgICAgIH0pO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvdGFsU2l6ZTsgaSArPSAxKSB7XG4gICAgICAgICAgICBjZWxsc1tpXSA9IHtcbiAgICAgICAgICAgICAgICBjYWxjdWxhdGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBldmVudHM6IFtdXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGxlbiA9IG9yZGVyZWRFdmVudHMubGVuZ3RoO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICAgICAgICBjb25zdCBldmVudCA9IG9yZGVyZWRFdmVudHNbaV07XG4gICAgICAgICAgICBsZXQgaW5kZXggPSBldmVudC5zdGFydEluZGV4ICogaG91clBhcnRzICsgZXZlbnQuc3RhcnRPZmZzZXQ7XG4gICAgICAgICAgICB3aGlsZSAoaW5kZXggPCBldmVudC5lbmRJbmRleCAqIGhvdXJQYXJ0cyAtIGV2ZW50LmVuZE9mZnNldCkge1xuICAgICAgICAgICAgICAgIGNlbGxzW2luZGV4XS5ldmVudHMucHVzaChldmVudCk7XG4gICAgICAgICAgICAgICAgaW5kZXggKz0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPCBsZW4pIHtcbiAgICAgICAgICAgIGxldCBldmVudCA9IG9yZGVyZWRFdmVudHNbaV07XG4gICAgICAgICAgICBpZiAoIWV2ZW50Lm92ZXJsYXBOdW1iZXIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBvdmVybGFwTnVtYmVyID0gZXZlbnQucG9zaXRpb24gKyAxO1xuICAgICAgICAgICAgICAgIGV2ZW50Lm92ZXJsYXBOdW1iZXIgPSBvdmVybGFwTnVtYmVyO1xuICAgICAgICAgICAgICAgIGNvbnN0IGV2ZW50UXVldWUgPSBbZXZlbnRdO1xuICAgICAgICAgICAgICAgIHdoaWxlIChldmVudCA9IGV2ZW50UXVldWUuc2hpZnQoKSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSBldmVudC5zdGFydEluZGV4ICogaG91clBhcnRzICsgZXZlbnQuc3RhcnRPZmZzZXQ7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChpbmRleCA8IGV2ZW50LmVuZEluZGV4ICogaG91clBhcnRzIC0gZXZlbnQuZW5kT2Zmc2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWNlbGxzW2luZGV4XS5jYWxjdWxhdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VsbHNbaW5kZXhdLmNhbGN1bGF0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjZWxsc1tpbmRleF0uZXZlbnRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGV2ZW50Q291bnRJbkNlbGwgPSBjZWxsc1tpbmRleF0uZXZlbnRzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBldmVudENvdW50SW5DZWxsOyBqICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRFdmVudEluQ2VsbCA9IGNlbGxzW2luZGV4XS5ldmVudHNbal07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWN1cnJlbnRFdmVudEluQ2VsbC5vdmVybGFwTnVtYmVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEV2ZW50SW5DZWxsLm92ZXJsYXBOdW1iZXIgPSBvdmVybGFwTnVtYmVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50UXVldWUucHVzaChjdXJyZW50RXZlbnRJbkNlbGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGkgKz0gMTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICBpZiAoIXRoaXMuc2xpZGVyT3B0aW9ucykge1xuICAgICAgICAgICAgdGhpcy5zbGlkZXJPcHRpb25zID0ge307XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zbGlkZXJPcHRpb25zLmxvb3AgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMuaG91clJhbmdlID0gKHRoaXMuZW5kSG91ciAtIHRoaXMuc3RhcnRIb3VyKSAqIHRoaXMuaG91clNlZ21lbnRzO1xuICAgICAgICBpZiAodGhpcy5kYXRlRm9ybWF0dGVyICYmIHRoaXMuZGF0ZUZvcm1hdHRlci5mb3JtYXREYXlWaWV3VGl0bGUpIHtcbiAgICAgICAgICAgIHRoaXMuZm9ybWF0VGl0bGUgPSB0aGlzLmRhdGVGb3JtYXR0ZXIuZm9ybWF0RGF5Vmlld1RpdGxlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZGF0ZVBpcGUgPSBuZXcgRGF0ZVBpcGUodGhpcy5sb2NhbGUpO1xuICAgICAgICAgICAgdGhpcy5mb3JtYXRUaXRsZSA9IGZ1bmN0aW9uKGRhdGU6IERhdGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0ZVBpcGUudHJhbnNmb3JtKGRhdGUsIHRoaXMuZm9ybWF0RGF5VGl0bGUpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmRhdGVGb3JtYXR0ZXIgJiYgdGhpcy5kYXRlRm9ybWF0dGVyLmZvcm1hdERheVZpZXdIb3VyQ29sdW1uKSB7XG4gICAgICAgICAgICB0aGlzLmZvcm1hdEhvdXJDb2x1bW5MYWJlbCA9IHRoaXMuZGF0ZUZvcm1hdHRlci5mb3JtYXREYXlWaWV3SG91ckNvbHVtbjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGVQaXBlID0gbmV3IERhdGVQaXBlKHRoaXMubG9jYWxlKTtcbiAgICAgICAgICAgIHRoaXMuZm9ybWF0SG91ckNvbHVtbkxhYmVsID0gZnVuY3Rpb24oZGF0ZTogRGF0ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYXRlUGlwZS50cmFuc2Zvcm0oZGF0ZSwgdGhpcy5mb3JtYXRIb3VyQ29sdW1uKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5sb2NrU3dpcGVUb1ByZXYpIHtcbiAgICAgICAgICAgIHRoaXMuc2xpZGVyLmxvY2tTd2lwZVRvUHJldih0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmxvY2tTd2lwZXMpIHtcbiAgICAgICAgICAgIHRoaXMuc2xpZGVyLmxvY2tTd2lwZXModHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlZnJlc2hWaWV3KCk7XG4gICAgICAgIHRoaXMuaG91ckNvbHVtbkxhYmVscyA9IHRoaXMuZ2V0SG91ckNvbHVtbkxhYmVscygpO1xuXG4gICAgICAgIHRoaXMuaW5pdGVkID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLmN1cnJlbnREYXRlQ2hhbmdlZEZyb21QYXJlbnRTdWJzY3JpcHRpb24gPSB0aGlzLmNhbGVuZGFyU2VydmljZS5jdXJyZW50RGF0ZUNoYW5nZWRGcm9tUGFyZW50JC5zdWJzY3JpYmUoY3VycmVudERhdGUgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZWZyZXNoVmlldygpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmV2ZW50U291cmNlQ2hhbmdlZFN1YnNjcmlwdGlvbiA9IHRoaXMuY2FsZW5kYXJTZXJ2aWNlLmV2ZW50U291cmNlQ2hhbmdlZCQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMub25EYXRhTG9hZGVkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc2xpZGVDaGFuZ2VkU3Vic2NyaXB0aW9uID0gdGhpcy5jYWxlbmRhclNlcnZpY2Uuc2xpZGVDaGFuZ2VkJC5zdWJzY3JpYmUoZGlyZWN0aW9uID0+IHtcbiAgICAgICAgICAgIGlmIChkaXJlY3Rpb24gPT09IDEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNsaWRlci5zbGlkZU5leHQoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAtMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVyLnNsaWRlUHJldigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnNsaWRlVXBkYXRlZFN1YnNjcmlwdGlvbiA9IHRoaXMuY2FsZW5kYXJTZXJ2aWNlLnNsaWRlVXBkYXRlZCQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2xpZGVyLnVwZGF0ZSgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgICAgIGNvbnN0IHRpdGxlID0gdGhpcy5nZXRUaXRsZSgpO1xuICAgICAgICB0aGlzLm9uVGl0bGVDaGFuZ2VkLmVtaXQodGl0bGUpO1xuXG4gICAgICAgIGlmICh0aGlzLnNjcm9sbFRvSG91ciA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGhvdXJDb2x1bW5zID0gdGhpcy5lbG0ubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZGF5dmlldy1ub3JtYWwtZXZlbnQtY29udGFpbmVyJykucXVlcnlTZWxlY3RvckFsbCgnLmNhbGVuZGFyLWhvdXItY29sdW1uJyk7XG4gICAgICAgICAgICBjb25zdCBtZSA9IHRoaXM7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBtZS5pbml0U2Nyb2xsUG9zaXRpb24gPSBob3VyQ29sdW1uc1ttZS5zY3JvbGxUb0hvdXIgLSBtZS5zdGFydEhvdXJdLm9mZnNldFRvcDtcbiAgICAgICAgICAgIH0sIDUwKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICAgICAgaWYgKCF0aGlzLmluaXRlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICgoY2hhbmdlcy5zdGFydEhvdXIgfHwgY2hhbmdlcy5lbmRIb3VyKSAmJiAoIWNoYW5nZXMuc3RhcnRIb3VyLmlzRmlyc3RDaGFuZ2UoKSB8fCAhY2hhbmdlcy5lbmRIb3VyLmlzRmlyc3RDaGFuZ2UoKSkpIHtcbiAgICAgICAgICAgIHRoaXMudmlld3MgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB0aGlzLmhvdXJSYW5nZSA9ICh0aGlzLmVuZEhvdXIgLSB0aGlzLnN0YXJ0SG91cikgKiB0aGlzLmhvdXJTZWdtZW50cztcbiAgICAgICAgICAgIHRoaXMuZGlyZWN0aW9uID0gMDtcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaFZpZXcoKTtcbiAgICAgICAgICAgIHRoaXMuaG91ckNvbHVtbkxhYmVscyA9IHRoaXMuZ2V0SG91ckNvbHVtbkxhYmVscygpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZXZlbnRTb3VyY2VDaGFuZ2UgPSBjaGFuZ2VzLmV2ZW50U291cmNlO1xuICAgICAgICBpZiAoZXZlbnRTb3VyY2VDaGFuZ2UgJiYgZXZlbnRTb3VyY2VDaGFuZ2UuY3VycmVudFZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLm9uRGF0YUxvYWRlZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbG9ja1N3aXBlVG9QcmV2ID0gY2hhbmdlcy5sb2NrU3dpcGVUb1ByZXY7XG4gICAgICAgIGlmIChsb2NrU3dpcGVUb1ByZXYpIHtcbiAgICAgICAgICAgIHRoaXMuc2xpZGVyLmxvY2tTd2lwZVRvUHJldihsb2NrU3dpcGVUb1ByZXYuY3VycmVudFZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGxvY2tTd2lwZXMgPSBjaGFuZ2VzLmxvY2tTd2lwZXM7XG4gICAgICAgIGlmIChsb2NrU3dpcGVzKSB7XG4gICAgICAgICAgICB0aGlzLnNsaWRlci5sb2NrU3dpcGVzKGxvY2tTd2lwZXMuY3VycmVudFZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50RGF0ZUNoYW5nZWRGcm9tUGFyZW50U3Vic2NyaXB0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnREYXRlQ2hhbmdlZEZyb21QYXJlbnRTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudERhdGVDaGFuZ2VkRnJvbVBhcmVudFN1YnNjcmlwdGlvbiA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5ldmVudFNvdXJjZUNoYW5nZWRTdWJzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRTb3VyY2VDaGFuZ2VkU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICB0aGlzLmV2ZW50U291cmNlQ2hhbmdlZFN1YnNjcmlwdGlvbiA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5zbGlkZUNoYW5nZWRTdWJzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuc2xpZGVDaGFuZ2VkU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICB0aGlzLnNsaWRlQ2hhbmdlZFN1YnNjcmlwdGlvbiA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5zbGlkZVVwZGF0ZWRTdWJzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuc2xpZGVVcGRhdGVkU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICB0aGlzLnNsaWRlVXBkYXRlZFN1YnNjcmlwdGlvbiA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvblNsaWRlQ2hhbmdlZCgpIHtcbiAgICAgICAgaWYgKHRoaXMuY2FsbGJhY2tPbkluaXQpIHtcbiAgICAgICAgICAgIHRoaXMuY2FsbGJhY2tPbkluaXQgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBkaXJlY3Rpb24gPSAwO1xuICAgICAgICBjb25zdCBjdXJyZW50Vmlld0luZGV4ID0gdGhpcy5jdXJyZW50Vmlld0luZGV4O1xuXG4gICAgICAgIHRoaXMuc2xpZGVyLmdldEFjdGl2ZUluZGV4KCkudGhlbigoY3VycmVudFNsaWRlSW5kZXgpID0+IHtcbiAgICAgICAgICAgIGN1cnJlbnRTbGlkZUluZGV4ID0gKGN1cnJlbnRTbGlkZUluZGV4ICsgMikgJSAzO1xuICAgICAgICAgICAgaWYoaXNOYU4oY3VycmVudFNsaWRlSW5kZXgpKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFNsaWRlSW5kZXggPSBjdXJyZW50Vmlld0luZGV4O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY3VycmVudFNsaWRlSW5kZXggLSBjdXJyZW50Vmlld0luZGV4ID09PSAxKSB7XG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uID0gMTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VycmVudFNsaWRlSW5kZXggPT09IDAgJiYgY3VycmVudFZpZXdJbmRleCA9PT0gMikge1xuICAgICAgICAgICAgICAgIGRpcmVjdGlvbiA9IDE7XG4gICAgICAgICAgICAgICAgdGhpcy5zbGlkZXIuc2xpZGVUbygxLCAwLCBmYWxzZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGN1cnJlbnRWaWV3SW5kZXggLSBjdXJyZW50U2xpZGVJbmRleCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIGRpcmVjdGlvbiA9IC0xO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjdXJyZW50U2xpZGVJbmRleCA9PT0gMiAmJiBjdXJyZW50Vmlld0luZGV4ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uID0gLTE7XG4gICAgICAgICAgICAgICAgdGhpcy5zbGlkZXIuc2xpZGVUbygzLCAwLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRWaWV3SW5kZXggPSBjdXJyZW50U2xpZGVJbmRleDtcbiAgICAgICAgICAgIHRoaXMubW92ZShkaXJlY3Rpb24pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBtb3ZlKGRpcmVjdGlvbjogbnVtYmVyKSB7XG4gICAgICAgIGlmIChkaXJlY3Rpb24gPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuICAgICAgICBjb25zdCBhZGphY2VudERhdGUgPSB0aGlzLmNhbGVuZGFyU2VydmljZS5nZXRBZGphY2VudENhbGVuZGFyRGF0ZSh0aGlzLm1vZGUsIGRpcmVjdGlvbik7XG4gICAgICAgIHRoaXMuY2FsZW5kYXJTZXJ2aWNlLnNldEN1cnJlbnREYXRlKGFkamFjZW50RGF0ZSk7XG4gICAgICAgIHRoaXMucmVmcmVzaFZpZXcoKTtcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSAwO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0SG91ckNvbHVtbkxhYmVscygpOiBzdHJpbmdbXSB7XG4gICAgICAgIGNvbnN0IGhvdXJDb2x1bW5MYWJlbHM6IHN0cmluZ1tdID0gW107XG4gICAgICAgIGZvciAobGV0IGhvdXIgPSAwLCBsZW5ndGggPSB0aGlzLnZpZXdzWzBdLnJvd3MubGVuZ3RoOyBob3VyIDwgbGVuZ3RoOyBob3VyICs9IDEpIHtcbiAgICAgICAgICAgIC8vIGhhbmRsZSBlZGdlIGNhc2UgZm9yIERTVFxuICAgICAgICAgICAgaWYgKGhvdXIgPT09IDAgJiYgdGhpcy52aWV3c1swXS5yb3dzW2hvdXJdLnRpbWUuZ2V0SG91cnMoKSAhPT0gdGhpcy5zdGFydEhvdXIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0aW1lID0gbmV3IERhdGUodGhpcy52aWV3c1swXS5yb3dzW2hvdXJdLnRpbWUpO1xuICAgICAgICAgICAgICAgIHRpbWUuc2V0RGF0ZSh0aW1lLmdldERhdGUoKSArIDEpO1xuICAgICAgICAgICAgICAgIHRpbWUuc2V0SG91cnModGhpcy5zdGFydEhvdXIpO1xuICAgICAgICAgICAgICAgIGhvdXJDb2x1bW5MYWJlbHMucHVzaCh0aGlzLmZvcm1hdEhvdXJDb2x1bW5MYWJlbCh0aW1lKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGhvdXJDb2x1bW5MYWJlbHMucHVzaCh0aGlzLmZvcm1hdEhvdXJDb2x1bW5MYWJlbCh0aGlzLnZpZXdzWzBdLnJvd3NbaG91cl0udGltZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBob3VyQ29sdW1uTGFiZWxzO1xuICAgIH1cblxuICAgIGdldFZpZXdEYXRhKHN0YXJ0VGltZTogRGF0ZSk6IElEYXlWaWV3IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJvd3M6IERheVZpZXdDb21wb25lbnQuY3JlYXRlRGF0ZU9iamVjdHMoc3RhcnRUaW1lLCB0aGlzLnN0YXJ0SG91ciwgdGhpcy5lbmRIb3VyLCB0aGlzLmhvdXJTZWdtZW50cyksXG4gICAgICAgICAgICBhbGxEYXlFdmVudHM6IFtdXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZ2V0UmFuZ2UoY3VycmVudERhdGU6IERhdGUpOiBJUmFuZ2Uge1xuICAgICAgICBjb25zdCB5ZWFyID0gY3VycmVudERhdGUuZ2V0RnVsbFllYXIoKSxcbiAgICAgICAgICAgIG1vbnRoID0gY3VycmVudERhdGUuZ2V0TW9udGgoKSxcbiAgICAgICAgICAgIGRhdGUgPSBjdXJyZW50RGF0ZS5nZXREYXRlKCksXG4gICAgICAgICAgICBzdGFydFRpbWUgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgZGF0ZSwgMTIsIDAsIDApLFxuICAgICAgICAgICAgZW5kVGltZSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoLCBkYXRlICsgMSwgMTIsIDAsIDApO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGFydFRpbWUsXG4gICAgICAgICAgICBlbmRUaW1lXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgb25EYXRhTG9hZGVkKCkge1xuICAgICAgICBjb25zdCBldmVudFNvdXJjZSA9IHRoaXMuZXZlbnRTb3VyY2UsXG4gICAgICAgICAgICBsZW4gPSBldmVudFNvdXJjZSA/IGV2ZW50U291cmNlLmxlbmd0aCA6IDAsXG4gICAgICAgICAgICBzdGFydFRpbWUgPSB0aGlzLnJhbmdlLnN0YXJ0VGltZSxcbiAgICAgICAgICAgIGVuZFRpbWUgPSB0aGlzLnJhbmdlLmVuZFRpbWUsXG4gICAgICAgICAgICB1dGNTdGFydFRpbWUgPSBEYXRlLlVUQyhzdGFydFRpbWUuZ2V0RnVsbFllYXIoKSwgc3RhcnRUaW1lLmdldE1vbnRoKCksIHN0YXJ0VGltZS5nZXREYXRlKCkpLFxuICAgICAgICAgICAgdXRjRW5kVGltZSA9IERhdGUuVVRDKGVuZFRpbWUuZ2V0RnVsbFllYXIoKSwgZW5kVGltZS5nZXRNb250aCgpLCBlbmRUaW1lLmdldERhdGUoKSksXG4gICAgICAgICAgICBjdXJyZW50Vmlld0luZGV4ID0gdGhpcy5jdXJyZW50Vmlld0luZGV4LFxuICAgICAgICAgICAgcm93cyA9IHRoaXMudmlld3NbY3VycmVudFZpZXdJbmRleF0ucm93cyxcbiAgICAgICAgICAgIGFsbERheUV2ZW50czogSURpc3BsYXlBbGxEYXlFdmVudFtdID0gdGhpcy52aWV3c1tjdXJyZW50Vmlld0luZGV4XS5hbGxEYXlFdmVudHMgPSBbXSxcbiAgICAgICAgICAgIG9uZUhvdXIgPSAzNjAwMDAwLFxuICAgICAgICAgICAgZXBzID0gMC4wMTYsXG4gICAgICAgICAgICByYW5nZVN0YXJ0Um93SW5kZXggPSB0aGlzLnN0YXJ0SG91ciAqIHRoaXMuaG91clNlZ21lbnRzLFxuICAgICAgICAgICAgcmFuZ2VFbmRSb3dJbmRleCA9IHRoaXMuZW5kSG91ciAqIHRoaXMuaG91clNlZ21lbnRzO1xuICAgICAgICBsZXQgbm9ybWFsRXZlbnRJblJhbmdlID0gZmFsc2U7XG5cbiAgICAgICAgZm9yIChsZXQgaG91ciA9IDA7IGhvdXIgPCB0aGlzLmhvdXJSYW5nZTsgaG91ciArPSAxKSB7XG4gICAgICAgICAgICByb3dzW2hvdXJdLmV2ZW50cyA9IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgICAgICAgY29uc3QgZXZlbnQgPSBldmVudFNvdXJjZVtpXTtcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50U3RhcnRUaW1lID0gZXZlbnQuc3RhcnRUaW1lO1xuICAgICAgICAgICAgY29uc3QgZXZlbnRFbmRUaW1lID0gZXZlbnQuZW5kVGltZTtcbiAgICAgICAgICAgIGxldCBldmVudFVUQ1N0YXJ0VGltZTogbnVtYmVyLFxuICAgICAgICAgICAgICAgIGV2ZW50VVRDRW5kVGltZTogbnVtYmVyO1xuXG4gICAgICAgICAgICBpZiAoZXZlbnQuYWxsRGF5KSB7XG4gICAgICAgICAgICAgICAgZXZlbnRVVENTdGFydFRpbWUgPSBldmVudFN0YXJ0VGltZS5nZXRUaW1lKCk7XG4gICAgICAgICAgICAgICAgZXZlbnRVVENFbmRUaW1lID0gZXZlbnRFbmRUaW1lLmdldFRpbWUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZXZlbnRVVENTdGFydFRpbWUgPSBEYXRlLlVUQyhldmVudFN0YXJ0VGltZS5nZXRGdWxsWWVhcigpLCBldmVudFN0YXJ0VGltZS5nZXRNb250aCgpLCBldmVudFN0YXJ0VGltZS5nZXREYXRlKCkpO1xuICAgICAgICAgICAgICAgIGV2ZW50VVRDRW5kVGltZSA9IERhdGUuVVRDKGV2ZW50RW5kVGltZS5nZXRGdWxsWWVhcigpLCBldmVudEVuZFRpbWUuZ2V0TW9udGgoKSwgZXZlbnRFbmRUaW1lLmdldERhdGUoKSArIDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZXZlbnRVVENFbmRUaW1lIDw9IHV0Y1N0YXJ0VGltZSB8fCBldmVudFVUQ1N0YXJ0VGltZSA+PSB1dGNFbmRUaW1lIHx8IGV2ZW50U3RhcnRUaW1lID49IGV2ZW50RW5kVGltZSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZXZlbnQuYWxsRGF5KSB7XG4gICAgICAgICAgICAgICAgYWxsRGF5RXZlbnRzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBldmVudFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBub3JtYWxFdmVudEluUmFuZ2UgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgbGV0IHRpbWVEaWZmZXJlbmNlU3RhcnQ6IG51bWJlcjtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnRVVENTdGFydFRpbWUgPCB1dGNTdGFydFRpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGltZURpZmZlcmVuY2VTdGFydCA9IDA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGltZURpZmZlcmVuY2VTdGFydCA9IChldmVudFN0YXJ0VGltZS5nZXRIb3VycygpICsgZXZlbnRTdGFydFRpbWUuZ2V0TWludXRlcygpIC8gNjApICogdGhpcy5ob3VyU2VnbWVudHM7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGV0IHRpbWVEaWZmZXJlbmNlRW5kOiBudW1iZXI7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50VVRDRW5kVGltZSA+IHV0Y0VuZFRpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGltZURpZmZlcmVuY2VFbmQgPSAodXRjRW5kVGltZSAtIHV0Y1N0YXJ0VGltZSkgLyBvbmVIb3VyICogdGhpcy5ob3VyU2VnbWVudHM7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGltZURpZmZlcmVuY2VFbmQgPSAoZXZlbnRFbmRUaW1lLmdldEhvdXJzKCkgKyBldmVudEVuZFRpbWUuZ2V0TWludXRlcygpIC8gNjApICogdGhpcy5ob3VyU2VnbWVudHM7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGV0IHN0YXJ0SW5kZXggPSBNYXRoLmZsb29yKHRpbWVEaWZmZXJlbmNlU3RhcnQpO1xuICAgICAgICAgICAgICAgIGxldCBlbmRJbmRleCA9IE1hdGguY2VpbCh0aW1lRGlmZmVyZW5jZUVuZCAtIGVwcyk7XG4gICAgICAgICAgICAgICAgbGV0IHN0YXJ0T2Zmc2V0ID0gMDtcbiAgICAgICAgICAgICAgICBsZXQgZW5kT2Zmc2V0ID0gMDtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ob3VyUGFydHMgIT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXJ0SW5kZXggPCByYW5nZVN0YXJ0Um93SW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0T2Zmc2V0ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0T2Zmc2V0ID0gTWF0aC5mbG9vcigodGltZURpZmZlcmVuY2VTdGFydCAtIHN0YXJ0SW5kZXgpICogdGhpcy5ob3VyUGFydHMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbmRJbmRleCA+IHJhbmdlRW5kUm93SW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZE9mZnNldCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRPZmZzZXQgPSBNYXRoLmZsb29yKChlbmRJbmRleCAtIHRpbWVEaWZmZXJlbmNlRW5kKSAqIHRoaXMuaG91clBhcnRzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChzdGFydEluZGV4IDwgcmFuZ2VTdGFydFJvd0luZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0SW5kZXggPSAwO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0SW5kZXggLT0gcmFuZ2VTdGFydFJvd0luZGV4O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZW5kSW5kZXggPiByYW5nZUVuZFJvd0luZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIGVuZEluZGV4ID0gcmFuZ2VFbmRSb3dJbmRleDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZW5kSW5kZXggLT0gcmFuZ2VTdGFydFJvd0luZGV4O1xuXG4gICAgICAgICAgICAgICAgaWYgKHN0YXJ0SW5kZXggPCBlbmRJbmRleCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkaXNwbGF5RXZlbnQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0SW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRJbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0T2Zmc2V0LFxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kT2Zmc2V0XG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IGV2ZW50U2V0ID0gcm93c1tzdGFydEluZGV4XS5ldmVudHM7XG4gICAgICAgICAgICAgICAgICAgIGlmIChldmVudFNldCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRTZXQucHVzaChkaXNwbGF5RXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRTZXQgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50U2V0LnB1c2goZGlzcGxheUV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3Nbc3RhcnRJbmRleF0uZXZlbnRzID0gZXZlbnRTZXQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobm9ybWFsRXZlbnRJblJhbmdlKSB7XG4gICAgICAgICAgICBsZXQgb3JkZXJlZEV2ZW50czogSURpc3BsYXlFdmVudFtdID0gW107XG4gICAgICAgICAgICBmb3IgKGxldCBob3VyID0gMDsgaG91ciA8IHRoaXMuaG91clJhbmdlOyBob3VyICs9IDEpIHtcbiAgICAgICAgICAgICAgICBpZiAocm93c1tob3VyXS5ldmVudHMpIHtcbiAgICAgICAgICAgICAgICAgICAgcm93c1tob3VyXS5ldmVudHMuc29ydChEYXlWaWV3Q29tcG9uZW50LmNvbXBhcmVFdmVudEJ5U3RhcnRPZmZzZXQpO1xuXG4gICAgICAgICAgICAgICAgICAgIG9yZGVyZWRFdmVudHMgPSBvcmRlcmVkRXZlbnRzLmNvbmNhdChyb3dzW2hvdXJdLmV2ZW50cyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9yZGVyZWRFdmVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMucGxhY2VFdmVudHMob3JkZXJlZEV2ZW50cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZWZyZXNoVmlldygpIHtcbiAgICAgICAgdGhpcy5yYW5nZSA9IHRoaXMuZ2V0UmFuZ2UodGhpcy5jYWxlbmRhclNlcnZpY2UuY3VycmVudERhdGUpO1xuICAgICAgICBpZiAodGhpcy5pbml0ZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IHRpdGxlID0gdGhpcy5nZXRUaXRsZSgpO1xuICAgICAgICAgICAgdGhpcy5vblRpdGxlQ2hhbmdlZC5lbWl0KHRpdGxlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2FsZW5kYXJTZXJ2aWNlLnBvcHVsYXRlQWRqYWNlbnRWaWV3cyh0aGlzKTtcbiAgICAgICAgdGhpcy5jYWxlbmRhclNlcnZpY2UucmFuZ2VDaGFuZ2VkKHRoaXMpO1xuICAgIH1cblxuICAgIGdldFRpdGxlKCk6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IHN0YXJ0aW5nRGF0ZSA9IG5ldyBEYXRlKHRoaXMucmFuZ2Uuc3RhcnRUaW1lLmdldFRpbWUoKSk7XG4gICAgICAgIHN0YXJ0aW5nRGF0ZS5zZXRIb3VycygxMiwgMCwgMCwgMCk7XG4gICAgICAgIHJldHVybiB0aGlzLmZvcm1hdFRpdGxlKHN0YXJ0aW5nRGF0ZSk7XG4gICAgfVxuXG4gICAgc2VsZWN0KHNlbGVjdGVkVGltZTogRGF0ZSwgZXZlbnRzOiBJRGlzcGxheUV2ZW50W10pIHtcbiAgICAgICAgbGV0IGRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIGlmICh0aGlzLm1hcmtEaXNhYmxlZCkge1xuICAgICAgICAgICAgZGlzYWJsZWQgPSB0aGlzLm1hcmtEaXNhYmxlZChzZWxlY3RlZFRpbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5vblRpbWVTZWxlY3RlZC5lbWl0KHtcbiAgICAgICAgICAgIHNlbGVjdGVkVGltZSxcbiAgICAgICAgICAgIGV2ZW50czogZXZlbnRzLm1hcChlID0+IGUuZXZlbnQpLFxuICAgICAgICAgICAgZGlzYWJsZWRcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcGxhY2VFdmVudHMob3JkZXJlZEV2ZW50czogSURpc3BsYXlFdmVudFtdKSB7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlUG9zaXRpb24ob3JkZXJlZEV2ZW50cyk7XG4gICAgICAgIERheVZpZXdDb21wb25lbnQuY2FsY3VsYXRlV2lkdGgob3JkZXJlZEV2ZW50cywgdGhpcy5ob3VyUmFuZ2UsIHRoaXMuaG91clBhcnRzKTtcbiAgICB9XG5cbiAgICBwbGFjZUFsbERheUV2ZW50cyhvcmRlcmVkRXZlbnRzOiBJRGlzcGxheUV2ZW50W10pIHtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVQb3NpdGlvbihvcmRlcmVkRXZlbnRzKTtcbiAgICB9XG5cbiAgICBvdmVybGFwKGV2ZW50MTogSURpc3BsYXlFdmVudCwgZXZlbnQyOiBJRGlzcGxheUV2ZW50KTogYm9vbGVhbiB7XG4gICAgICAgIGxldCBlYXJseUV2ZW50ID0gZXZlbnQxLFxuICAgICAgICAgICAgbGF0ZUV2ZW50ID0gZXZlbnQyO1xuICAgICAgICBpZiAoZXZlbnQxLnN0YXJ0SW5kZXggPiBldmVudDIuc3RhcnRJbmRleCB8fCAoZXZlbnQxLnN0YXJ0SW5kZXggPT09IGV2ZW50Mi5zdGFydEluZGV4ICYmIGV2ZW50MS5zdGFydE9mZnNldCA+IGV2ZW50Mi5zdGFydE9mZnNldCkpIHtcbiAgICAgICAgICAgIGVhcmx5RXZlbnQgPSBldmVudDI7XG4gICAgICAgICAgICBsYXRlRXZlbnQgPSBldmVudDE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZWFybHlFdmVudC5lbmRJbmRleCA8PSBsYXRlRXZlbnQuc3RhcnRJbmRleCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuICEoZWFybHlFdmVudC5lbmRJbmRleCAtIGxhdGVFdmVudC5zdGFydEluZGV4ID09PSAxICYmIGVhcmx5RXZlbnQuZW5kT2Zmc2V0ICsgbGF0ZUV2ZW50LnN0YXJ0T2Zmc2V0ID49IHRoaXMuaG91clBhcnRzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNhbGN1bGF0ZVBvc2l0aW9uKGV2ZW50czogSURpc3BsYXlFdmVudFtdKSB7XG4gICAgICAgIGNvbnN0IGxlbiA9IGV2ZW50cy5sZW5ndGgsXG4gICAgICAgICAgICBpc0ZvcmJpZGRlbjogYm9vbGVhbltdID0gbmV3IEFycmF5KGxlbik7XG4gICAgICAgIGxldCBtYXhDb2x1bW4gPSAwLFxuICAgICAgICAgICAgY29sOiBudW1iZXI7XG5cblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICAgICAgICBmb3IgKGNvbCA9IDA7IGNvbCA8IG1heENvbHVtbjsgY29sICs9IDEpIHtcbiAgICAgICAgICAgICAgICBpc0ZvcmJpZGRlbltjb2xdID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGk7IGogKz0gMSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm92ZXJsYXAoZXZlbnRzW2ldLCBldmVudHNbal0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzRm9yYmlkZGVuW2V2ZW50c1tqXS5wb3NpdGlvbl0gPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoY29sID0gMDsgY29sIDwgbWF4Q29sdW1uOyBjb2wgKz0gMSkge1xuICAgICAgICAgICAgICAgIGlmICghaXNGb3JiaWRkZW5bY29sXSkge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY29sIDwgbWF4Q29sdW1uKSB7XG4gICAgICAgICAgICAgICAgZXZlbnRzW2ldLnBvc2l0aW9uID0gY29sO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBldmVudHNbaV0ucG9zaXRpb24gPSBtYXhDb2x1bW4rKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmRpciA9PT0gJ3J0bCcpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICBldmVudHNbaV0ucG9zaXRpb24gPSBtYXhDb2x1bW4gLSAxIC0gZXZlbnRzW2ldLnBvc2l0aW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXZlbnRTZWxlY3RlZChldmVudDogSUV2ZW50KSB7XG4gICAgICAgIHRoaXMub25FdmVudFNlbGVjdGVkLmVtaXQoZXZlbnQpO1xuICAgIH1cblxuICAgIHNldFNjcm9sbFBvc2l0aW9uKHNjcm9sbFBvc2l0aW9uOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5pbml0U2Nyb2xsUG9zaXRpb24gPSBzY3JvbGxQb3NpdGlvbjtcbiAgICB9XG59XG4iXX0=