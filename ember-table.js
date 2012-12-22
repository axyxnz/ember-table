// Generated by CoffeeScript 1.4.0
(function() {

  (function($) {
    return $.getScrollbarWidth = function() {
      var $div, $textarea1, $textarea2, scrollbarWidth;
      scrollbarWidth = 0;
      if (!scrollbarWidth) {
        if ($.browser.msie) {
          $textarea1 = $("<textarea cols=\"10\" rows=\"2\"></textarea>").css({
            position: "absolute",
            top: -1000,
            left: -1000
          }).appendTo("body");
          $textarea2 = $("<textarea cols=\"10\" rows=\"2\" style=\"overflow: hidden;\"></textarea>").css({
            position: "absolute",
            top: -1000,
            left: -1000
          }).appendTo("body");
          scrollbarWidth = $textarea1.width() - $textarea2.width();
          $textarea1.add($textarea2).remove();
        } else {
          $div = $("<div />").css({
            width: 100,
            height: 100,
            overflow: "auto",
            position: "absolute",
            top: -1000,
            left: -1000
          }).prependTo("body").append("<div />").find("div").css({
            width: "100%",
            height: 200
          });
          scrollbarWidth = 100 - $div.width();
          $div.parent().remove();
        }
      }
      return scrollbarWidth;
    };
  })(jQuery);

}).call(this);
;// Generated by CoffeeScript 1.4.0
(function() {

  Ember.ResizeHandler = Ember.Mixin.create({
    resizeEndDelay: 200,
    resizing: false,
    onResizeStart: Ember.required(Function),
    onResizeEnd: Ember.required(Function),
    onResize: Ember.required(Function),
    debounceResizeEnd: Ember.computed(function() {
      var _this = this;
      return _.debounce(function(event) {
        _this.set('resizing', false);
        return typeof _this.onResizeEnd === "function" ? _this.onResizeEnd(event) : void 0;
      }, this.get('resizeEndDelay'));
    }).property('resizeEndDelay'),
    resizeHandler: Ember.computed(function() {
      return _.bind(this.handleWindowResize, this);
    }).property(),
    handleWindowResize: function(event) {
      if (!this.get('resizing')) {
        this.set('resizing', true);
        if (typeof this.onResizeStart === "function") {
          this.onResizeStart(event);
        }
      } else {
        if (typeof this.onResize === "function") {
          this.onResize(event);
        }
      }
      return this.get('debounceResizeEnd')(event);
    },
    didInsertElement: function() {
      this._super();
      return $(window).bind('resize', this.get("resizeHandler"));
    },
    willDestroy: function() {
      $(window).unbind('resize', this.get("resizeHandler"));
      return this._super();
    }
  });

}).call(this);
;// Generated by CoffeeScript 1.4.0
(function() {

  Ember.StyleBindingsMixin = Ember.Mixin.create({
    concatenatedProperties: ['styleBindings'],
    attributeBindings: ['style'],
    unitType: 'px',
    createStyleString: function(styleName, property) {
      var value;
      value = this.get(property);
      if (value === void 0) {
        return;
      }
      if (Ember.typeOf(value) === 'number') {
        value = value + this.get('unitType');
      }
      return "" + styleName + ":" + value + ";";
    },
    applyStyleBindings: function() {
      var lookup, properties, styleBindings, styleComputed, styles,
        _this = this;
      styleBindings = this.styleBindings;
      if (!styleBindings) {
        return;
      }
      lookup = {};
      styleBindings.forEach(function(binding) {
        var property, style, _ref;
        _ref = binding.split(':'), property = _ref[0], style = _ref[1];
        return lookup[style || property] = property;
      });
      styles = _.keys(lookup);
      properties = _.values(lookup);
      styleComputed = Ember.computed(function() {
        var styleString, styleTokens;
        styleTokens = styles.map(function(style) {
          return _this.createStyleString(style, lookup[style]);
        });
        styleString = styleTokens.join('');
        if (styleString.length !== 0) {
          return styleString;
        }
      });
      styleComputed.property.apply(styleComputed, properties);
      return Ember.defineProperty(this, 'style', styleComputed);
    },
    init: function() {
      this.applyStyleBindings();
      return this._super();
    }
  });

}).call(this);
;// Generated by CoffeeScript 1.4.0
(function() {

  Ember.LazyContainerView = Ember.ContainerView.extend(Ember.StyleBindingsMixin, {
    classNames: 'lazy-list-container',
    styleBindings: ['height'],
    content: null,
    itemViewClass: null,
    viewportHeight: null,
    rowHeight: null,
    scrollTop: null,
    init: function() {
      this._super();
      return this.onNumItemsInViewportDidChange();
    },
    onNumItemsInViewportDidChange: Ember.observer(function() {
      var childViews, itemViewClass, newNumViews, numViewsToInsert, oldNumViews, viewsToAdd, viewsToRemove, _i, _results;
      itemViewClass = Ember.get(this.get('itemViewClass'));
      newNumViews = this.get('numItemsInViewport');
      if (!(itemViewClass && newNumViews)) {
        return;
      }
      childViews = this.get('childViews');
      oldNumViews = this.get('childViews.length');
      numViewsToInsert = newNumViews - oldNumViews;
      if (numViewsToInsert < 0) {
        viewsToRemove = childViews.slice(newNumViews, oldNumViews);
        return childViews.removeObjects(viewsToRemove);
      } else if (numViewsToInsert > 0) {
        viewsToAdd = (function() {
          _results = [];
          for (var _i = 0; 0 <= numViewsToInsert ? _i < numViewsToInsert : _i > numViewsToInsert; 0 <= numViewsToInsert ? _i++ : _i--){ _results.push(_i); }
          return _results;
        }).apply(this).map(function() {
          return itemViewClass.create();
        });
        return childViews.pushObjects(viewsToAdd);
      }
    }, 'numItemsInViewport', 'itemViewClass'),
    numItemsInViewport: Ember.computed(function() {
      return Math.ceil(this.get('viewportHeight') / this.get('rowHeight')) + 1;
    }).property('viewportHeight', 'rowHeight'),
    height: Ember.computed(function() {
      return this.get('content.length') * this.get('rowHeight');
    }).property('content.length', 'rowHeight'),
    startIndex: Ember.computed(function() {
      var index, numContent, numViews, rowHeight, scrollTop;
      numContent = this.get('content.length');
      numViews = this.get('childViews.length');
      rowHeight = this.get('rowHeight');
      scrollTop = this.get('scrollTop');
      index = Math.floor(scrollTop / rowHeight);
      if (index + numViews >= numContent) {
        index = numContent - numViews;
      }
      if (index < 0) {
        return 0;
      } else {
        return index;
      }
    }).property('content.length', 'childViews.length', 'rowHeight', 'scrollTop'),
    viewportDidChange: Ember.observer(function() {
      var content, numChildViews, numShownViews, startIndex, views, _i, _j, _results, _results1,
        _this = this;
      content = this.get('content');
      views = this.get('childViews');
      startIndex = this.get('startIndex');
      numShownViews = Math.min(this.get('childViews.length'), this.get('content.length'));
      numChildViews = this.get('childViews.length');
      (function() {
        _results = [];
        for (var _i = 0; 0 <= numShownViews ? _i < numShownViews : _i > numShownViews; 0 <= numShownViews ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this).forEach(function(i) {
        var childView, item, itemIndex;
        itemIndex = startIndex + i;
        childView = views.objectAt(itemIndex % numShownViews);
        item = _this.get('content').objectAt(itemIndex);
        if (item !== childView.get('content')) {
          childView.teardownContent();
          childView.set('itemIndex', itemIndex);
          childView.set('content', item);
          return childView.prepareContent();
        }
      });
      return (function() {
        _results1 = [];
        for (var _j = numShownViews; numShownViews <= numChildViews ? _j < numChildViews : _j > numChildViews; numShownViews <= numChildViews ? _j++ : _j--){ _results1.push(_j); }
        return _results1;
      }).apply(this).forEach(function(i) {
        var childView;
        childView = views.objectAt(i);
        return childView.set('content', null);
      });
    }, 'childViews', 'content', 'startIndex')
  });

  Ember.LazyItemView = Ember.View.extend(Ember.StyleBindingsMixin, {
    itemIndex: null,
    prepareContent: Ember.K,
    teardownContent: Ember.K,
    rowHeightBinding: 'parentView.rowHeight',
    styleBindings: ['width', 'top', 'display'],
    top: Ember.computed(function() {
      return this.get('itemIndex') * this.get('rowHeight');
    }).property('itemIndex', 'rowHeight'),
    display: Ember.computed(function() {
      if (!this.get('content')) {
        return 'none';
      }
    }).property('content')
  });

}).call(this);
;// Generated by CoffeeScript 1.4.0
(function() {

  Ember.MultiItemViewCollectionView = Ember.CollectionView.extend({
    itemViewClassField: null,
    createChildView: function(view, attrs) {
      var itemViewClass, itemViewClassField;
      itemViewClassField = this.get('itemViewClassField');
      itemViewClass = attrs.content.get(itemViewClassField);
      if (typeof itemViewClass === 'string') {
        itemViewClass = Ember.get(Ember.lookup, itemViewClass);
      }
      return this._super(itemViewClass, attrs);
    }
  });

  Ember.MouseWheelHandlerMixin = Ember.Mixin.create({
    onMouseWheel: Ember.K,
    didInsertElement: function() {
      var _this = this;
      this._super();
      return this.$().bind('mousewheel', function(event, delta, deltaX, deltaY) {
        return Ember.run(_this, _this.onMouseWheel, event, delta, deltaX, deltaY);
      });
    },
    willDestroy: function() {
      var _ref;
      if ((_ref = this.$()) != null) {
        _ref.unbind('mousewheel');
      }
      return this._super();
    }
  });

  Ember.ScrollHandlerMixin = Ember.Mixin.create({
    onScroll: Ember.K,
    didInsertElement: function() {
      var _this = this;
      this._super();
      return this.$().bind('scroll', function(event) {
        return Ember.run(_this, _this.onScroll, event);
      });
    },
    willDestroy: function() {
      var _ref;
      if ((_ref = this.$()) != null) {
        _ref.unbind('scroll');
      }
      return this._super();
    }
  });

}).call(this);
;Ember.TEMPLATES["tables-container"]=Ember.Handlebars.compile("\n  {{#if controller.hasHeader}}\n    {{view Ember.Table.HeaderTableContainer}}\n  {{/if}}\n  {{view Ember.Table.BodyTableContainer}}\n  {{#if controller.hasFooter}}\n    {{view Ember.Table.FooterTableContainer}}\n  {{/if}}\n  {{view Ember.Table.ScrollContainer}}");
Ember.TEMPLATES["scroll-container"]=Ember.Handlebars.compile("\n  {{view Ember.Table.ScrollPanel}}");
Ember.TEMPLATES["header-container"]=Ember.Handlebars.compile("\n  <div class='table-fixed-wrapper'>\n    {{view Ember.Table.HeaderBlock\n      columnsBinding=\"controller.fixedColumns\"\n      widthBinding=\"controller._fixedBlockWidth\"\n      heightBinding=\"controller.headerHeight\"\n    }}\n    {{view Ember.Table.HeaderBlock classNames=\"right-table-block\"\n      columnsBinding=\"controller.tableColumns\"\n      scrollLeftBinding=\"controller._tableScrollLeft\"\n      widthBinding=\"controller._tableBlockWidth\"\n      heightBinding=\"controller.headerHeight\"\n    }}\n  </div>");
Ember.TEMPLATES["body-container"]=Ember.Handlebars.compile("\n  <div class='table-scrollable-wrapper'>\n    {{view Ember.Table.LazyTableBlock\n      contentBinding=\"controller.bodyContent\"\n      columnsBinding=\"controller.fixedColumns\"\n      scrollTopBinding=\"controller._tableScrollTop\"\n      widthBinding=\"controller._fixedBlockWidth\"\n      viewportHeightBinding=\"controller._bodyHeight\"\n    }}\n    {{view Ember.Table.LazyTableBlock classNames=\"right-table-block\"\n      contentBinding=\"controller.bodyContent\"\n      columnsBinding=\"controller.tableColumns\"\n      scrollTopBinding=\"controller._tableScrollTop\"\n      scrollLeftBinding=\"controller._tableScrollLeft\"\n      widthBinding=\"controller._tableBlockWidth\"\n      viewportHeightBinding=\"controller._bodyHeight\"\n    }}\n  </div>");
Ember.TEMPLATES["footer-container"]=Ember.Handlebars.compile("\n  <div class='table-fixed-wrapper'>\n    {{view Ember.Table.TableBlock\n      contentBinding=\"controller.footerContent\"\n      columnsBinding=\"controller.fixedColumns\"\n      widthBinding=\"controller._fixedBlockWidth\"\n      heightBinding=\"controller.footerHeight\"\n    }}\n    {{view Ember.Table.TableBlock classNames=\"right-table-block\"\n      contentBinding=\"controller.footerContent\"\n      columnsBinding=\"controller.tableColumns\"\n      scrollLeftBinding=\"controller._tableScrollLeft\"\n      widthBinding=\"controller._tableBlockWidth\"\n      heightBinding=\"controller.footerHeight\"\n    }}\n  </div>");
Ember.TEMPLATES["table-row"]=Ember.Handlebars.compile("\n  {{#group}}\n    {{view Ember.MultiItemViewCollectionView\n      rowBinding=\"view.row\"\n      contentBinding=\"view.columns\"\n      itemViewClassField=\"tableCellViewClass\"\n      widthBinding=\"controller._tableColumnsWidth\"\n    }}\n  {{/group}}");
Ember.TEMPLATES["table-cell"]=Ember.Handlebars.compile("\n  <span class='content'>{{view.cellContent}}</span>");
Ember.TEMPLATES["header-row"]=Ember.Handlebars.compile("\n  {{view Ember.MultiItemViewCollectionView\n    contentBinding=\"view.content\"\n    itemViewClassField=\"headerCellViewClass\"\n  }}");
Ember.TEMPLATES["header-cell"]=Ember.Handlebars.compile("\n  <span {{action sortByColumn target=\"controller\"}}>\n    {{view.content.headerCellName}}\n  </span>");
;// Generated by CoffeeScript 1.4.0
(function() {

  Ember.Table = Ember.Namespace.create();

  Ember.Table.ColumnDefinition = Ember.Object.extend({
    headerCellName: null,
    columnWidth: 150,
    headerCellViewClass: 'Ember.Table.HeaderCell',
    tableCellViewClass: 'Ember.Table.TableCell',
    getCellContent: Ember.required(Function),
    setCellContent: Ember.K
  });

  Ember.Table.Row = Ember.Object.extend({
    content: null,
    isHovering: false,
    isSelected: false,
    isShowing: true
  });

  Ember.Table.RowArrayProxy = Ember.ArrayProxy.extend({
    tableRowClass: null,
    content: null,
    rowContent: Ember.computed(function() {
      return Ember.A();
    }).property(),
    objectAt: function(idx) {
      var item, row, tableRowClass;
      row = this.get('rowContent')[idx];
      if (row) {
        return row;
      }
      tableRowClass = this.get('tableRowClass');
      item = this.get('content').objectAt(idx);
      row = tableRowClass.create({
        content: item
      });
      this.get('rowContent')[idx] = row;
      return row;
    }
  });

  Ember.Table.TableController = Ember.Controller.extend({
    columns: null,
    numFixedColumns: 0,
    numFooterRow: 0,
    rowHeight: 30,
    headerHeight: 50,
    footerHeight: 30,
    hasHeader: true,
    hasFooter: true,
    tableRowClass: 'Ember.Table.Row',
    _tableScrollTop: 0,
    _tableScrollLeft: 0,
    _width: null,
    _height: null,
    _scrollbarSize: null,
    bodyContent: Ember.computed(function() {
      var tableRowClass;
      tableRowClass = this.get('tableRowClass');
      if (typeof tableRowClass === 'string') {
        tableRowClass = Ember.get(Ember.lookup, tableRowClass);
      }
      return Ember.Table.RowArrayProxy.create({
        tableRowClass: tableRowClass,
        content: this.get('content')
      });
    }).property('content', 'tableRowClass'),
    footerContent: Ember.computed(function(key, value) {
      if (value) {
        return value;
      } else {
        return Ember.A();
      }
    }).property(),
    fixedColumns: Ember.computed(function() {
      var columns, numFixedColumns;
      columns = this.get('columns');
      if (!columns) {
        return Ember.A();
      }
      numFixedColumns = this.get('numFixedColumns') || 0;
      return columns.slice(0, numFixedColumns);
    }).property('columns', 'numFixedColumns'),
    tableColumns: Ember.computed(function() {
      var columns, numFixedColumns;
      columns = this.get('columns');
      if (!columns) {
        return Ember.A();
      }
      numFixedColumns = this.get('numFixedColumns') || 0;
      return columns.slice(numFixedColumns, columns.get('length'));
    }).property('columns', 'numFixedColumns'),
    sortByColumn: Ember.K,
    _fixedColumnsWidth: Ember.computed(function() {
      return this._getTotalWidth(this.get('fixedColumns'));
    }).property('fixedColumns.@each.columnWidth'),
    _tableColumnsWidth: Ember.computed(function() {
      return this._getTotalWidth(this.get('tableColumns'));
    }).property('tableColumns.@each.columnWidth'),
    _rowWidth: Ember.computed(function() {
      var columnsWidth, tableContainerWidth;
      columnsWidth = this.get('_tableColumnsWidth');
      tableContainerWidth = this.get('_tableContainerWidth');
      if (columnsWidth < tableContainerWidth) {
        return tableContainerWidth;
      }
      return columnsWidth;
    }).property('_tableColumnsWidth', '_tableContainerWidth'),
    _bodyHeight: Ember.computed(function() {
      var bodyHeight, footerHeight, headerHeight, scrollbarSize;
      bodyHeight = this.get('_height');
      headerHeight = this.get('headerHeight');
      footerHeight = this.get('footerHeight');
      scrollbarSize = this.get('_scrollbarSize');
      if (this.get('_tableColumnsWidth') > this.get('_width') - this.get('_fixedColumnsWidth')) {
        bodyHeight -= scrollbarSize;
      }
      if (this.get('hasHeader')) {
        bodyHeight -= headerHeight;
      }
      if (this.get('hasFooter')) {
        bodyHeight -= footerHeight;
      }
      return bodyHeight;
    }).property('_height', 'headerHeight', 'footerHeight', '_scrollbarSize', 'hasHeader', 'hasFooter', '_tableColumnsWidth', '_width', '_fixedColumnsWidth'),
    _tableBlockWidth: Ember.computed(function() {
      return this.get('_width') - this.get('_fixedColumnsWidth') - this.get('_scrollbarSize');
    }).property('_width', '_fixedColumnsWidth', '_scrollbarSize'),
    _fixedBlockWidthBinding: '_fixedColumnsWidth',
    _tableContentHeight: Ember.computed(function() {
      return this.get('rowHeight') * this.get('bodyContent.length');
    }).property('rowHeight', 'bodyContent.length'),
    _tableContainerWidth: Ember.computed(function() {
      return this.get('_width') - this.get('_scrollbarSize');
    }).property('_width', '_scrollbarSize'),
    _scrollContainerWidth: Ember.computed(function() {
      return this.get('_width') - this.get('_fixedColumnsWidth') - this.get('_scrollbarSize');
    }).property('_width', '_fixedColumnsWidth', '_scrollbarSize'),
    _scrollContainerHeight: Ember.computed(function() {
      var containerHeight;
      return containerHeight = this.get('_height') - this.get('headerHeight');
    }).property('_height', 'headerHeight'),
    _getTotalWidth: function(columns) {
      if (!columns) {
        return 0;
      }
      return _.reduce(columns.getEach('columnWidth'), (function(total, w) {
        return total + w;
      }), 0);
    }
  });

}).call(this);
;// Generated by CoffeeScript 1.4.0
(function() {

  Ember.Table.TablesContainer = Ember.View.extend(Ember.ResizeHandler, {
    templateName: 'tables-container',
    classNames: 'tables-container',
    didInsertElement: function() {
      var isLion, scrollBarWidth;
      this._super();
      this.elementSizeDidChange();
      scrollBarWidth = $.getScrollbarWidth();
      isLion = (typeof navigator !== "undefined" && navigator !== null ? navigator.appVersion['10_7'] : void 0) !== -1 && scrollBarWidth === 0;
      if (isLion) {
        scrollBarWidth = 8;
      }
      return this.set('controller._scrollbarSize', scrollBarWidth);
    },
    onResize: function() {
      return this.elementSizeDidChange();
    },
    elementSizeDidChange: function() {
      this.set('controller._width', this.$().width());
      return this.set('controller._height', this.$().height());
    }
  });

  Ember.Table.TableContainer = Ember.View.extend(Ember.StyleBindingsMixin, {
    classNames: ['table-container'],
    styleBindings: ['height', 'width']
  });

  Ember.Table.TableBlock = Ember.CollectionView.extend(Ember.StyleBindingsMixin, {
    classNames: ['table-block'],
    itemViewClass: 'Ember.Table.TableRow',
    styleBindings: ['width', 'height'],
    columns: null,
    content: null,
    scrollLeft: null,
    onScrollLeftDidChange: Ember.observer(function() {
      return this.$().scrollLeft(this.get('scrollLeft'));
    }, 'scrollLeft')
  });

  Ember.Table.LazyTableBlock = Ember.LazyContainerView.extend({
    classNames: ['table-block'],
    itemViewClass: 'Ember.Table.TableRow',
    rowHeightBinding: 'controller.rowHeight',
    styleBindings: ['width'],
    columns: null,
    content: null,
    scrollLeft: null,
    scrollTop: null,
    onScrollLeftDidChange: Ember.observer(function() {
      return this.$().scrollLeft(this.get('scrollLeft'));
    }, 'scrollLeft')
  });

  Ember.Table.TableRow = Ember.LazyItemView.extend({
    templateName: 'table-row',
    classNames: 'table-row',
    classNameBindings: 'row.active:active',
    styleBindings: ['width', 'height'],
    rowBinding: 'content',
    columnsBinding: 'parentView.columns',
    widthBinding: 'controller._rowWidth',
    heightBinding: 'controller.rowHeight',
    mouseEnter: function(event) {
      return this.set('row.active', true);
    },
    mouseLeave: function(event) {
      return this.set('row.active', false);
    },
    teardownContent: function() {
      if (!this.get('row')) {
        return;
      }
      return this.set('row.active', false);
    }
  });

  Ember.Table.TableCell = Ember.View.extend(Ember.StyleBindingsMixin, {
    templateName: 'table-cell',
    classNames: ['table-cell'],
    styleBindings: ['width'],
    rowBinding: 'parentView.row',
    columnBinding: 'content',
    rowContentBinding: 'row.content',
    widthBinding: 'column.columnWidth',
    cellContent: Ember.computed(function(key, value) {
      var column, row;
      row = this.get('rowContent');
      column = this.get('column');
      if (!(row && column)) {
        return;
      }
      if (arguments.length === 1) {
        value = column.getCellContent(row);
      } else {
        column.setCellContent(row, value);
      }
      return value;
    }).property('rowContent.isLoading', 'column')
  });

  Ember.Table.HeaderBlock = Ember.Table.TableBlock.extend({
    classNames: ['header-block'],
    itemViewClass: 'Ember.Table.HeaderRow',
    content: Ember.computed(function() {
      return [this.get('columns')];
    }).property('columns')
  });

  Ember.Table.HeaderRow = Ember.View.extend(Ember.StyleBindingsMixin, {
    templateName: 'header-row',
    classNames: ['table-row', 'header-row'],
    styleBindings: ['height'],
    columnsBinding: 'content',
    heightBinding: 'controller.headerHeight',
    sortableOption: Ember.computed(function() {
      return {
        axis: 'x',
        cursor: 'pointer',
        helper: 'clone',
        containment: 'parent',
        placeholder: 'ui-state-highlight',
        scroll: true,
        tolerance: 'pointer',
        update: _.bind(this.onColumnSort, this)
      };
    }).property(),
    didInsertElement: function() {
      this._super();
      return this.$('> div').sortable(this.get('sortableOption'));
    },
    onColumnSort: function(event, ui) {
      var column, columns, newIndex, view;
      newIndex = ui.item.index();
      view = Ember.View.views[ui.item.attr('id')];
      columns = this.get('columns');
      column = view.get('column');
      columns.removeObject(column);
      return columns.insertAt(newIndex, column);
    }
  });

  Ember.Table.HeaderCell = Ember.View.extend(Ember.StyleBindingsMixin, {
    templateName: 'header-cell',
    classNames: ['table-cell', 'header-cell'],
    styleBindings: ['width', 'height'],
    columnBinding: 'content',
    widthBinding: 'column.columnWidth',
    heightBinding: 'controller.headerHeight',
    resizableOption: Ember.computed(function() {
      return {
        handles: 'e',
        minHeight: 40,
        minWidth: 100,
        maxWidth: 500,
        resize: _.bind(this.onColumnResize, this)
      };
    }).property(),
    didInsertElement: function() {
      return this.$().resizable(this.get('resizableOption'));
    },
    onColumnResize: function(event, ui) {
      return this.set('width', ui.size.width);
    }
  });

  Ember.Table.HeaderTableContainer = Ember.Table.TableContainer.extend(Ember.MouseWheelHandlerMixin, {
    templateName: 'header-container',
    classNames: ['table-container', 'fixed-table-container', 'header-container'],
    heightBinding: 'controller.headerHeight',
    widthBinding: 'controller._tableContainerWidth',
    scrollLeftBinding: 'controller._tableScrollLeft',
    onMouseWheel: function(event, delta, deltaX, deltaY) {
      var scrollLeft;
      scrollLeft = this.$('.right-table-block').scrollLeft() + deltaX * 50;
      this.set('scrollLeft', scrollLeft);
      return event.preventDefault();
    }
  });

  Ember.Table.BodyTableContainer = Ember.Table.TableContainer.extend(Ember.MouseWheelHandlerMixin, Ember.ScrollHandlerMixin, {
    templateName: 'body-container',
    classNames: ['table-container', 'body-container'],
    heightBinding: 'controller._bodyHeight',
    widthBinding: 'controller._width',
    scrollTopBinding: 'controller._tableScrollTop',
    scrollLeftBinding: 'controller._tableScrollLeft',
    onScroll: function(event) {
      this.set('scrollTop', event.target.scrollTop);
      return event.preventDefault();
    },
    onMouseWheel: function(event, delta, deltaX, deltaY) {
      var scrollLeft;
      if (!(Math.abs(deltaX) > Math.abs(deltaY))) {
        return;
      }
      scrollLeft = this.$('.right-table-block').scrollLeft() + deltaX * 50;
      this.set('scrollLeft', scrollLeft);
      return event.preventDefault();
    }
  });

  Ember.Table.FooterTableContainer = Ember.Table.TableContainer.extend(Ember.MouseWheelHandlerMixin, {
    templateName: 'footer-container',
    classNames: ['table-container', 'fixed-table-container', 'footer-container'],
    heightBinding: 'controller.footerHeight',
    widthBinding: 'controller._tableContainerWidth',
    scrollLeftBinding: 'controller._tableScrollLeft',
    onMouseWheel: function(event, delta, deltaX, deltaY) {
      var scrollLeft;
      scrollLeft = this.$('.right-table-block').scrollLeft() + deltaX * 50;
      this.set('scrollLeft', scrollLeft);
      return event.preventDefault();
    }
  });

  Ember.Table.ScrollContainer = Ember.View.extend(Ember.StyleBindingsMixin, Ember.ScrollHandlerMixin, {
    templateName: 'scroll-container',
    classNames: ['scroll-container'],
    styleBindings: ['top', 'left', 'width', 'height'],
    widthBinding: 'controller._scrollContainerWidth',
    heightBinding: 'controller._scrollContainerHeight',
    topBinding: 'controller.headerHeight',
    leftBinding: 'controller._fixedColumnsWidth',
    scrollTopBinding: 'controller._tableScrollTop',
    scrollLeftBinding: 'controller._tableScrollLeft',
    onScroll: function(event) {
      this.set('scrollLeft', event.target.scrollLeft);
      return event.preventDefault();
    },
    onScrollLeftDidChange: Ember.observer(function() {
      return this.$().scrollLeft(this.get('scrollLeft'));
    }, 'scrollLeft')
  });

  Ember.Table.ScrollPanel = Ember.View.extend(Ember.StyleBindingsMixin, {
    classNames: ['scroll-panel'],
    styleBindings: ['width', 'height'],
    widthBinding: 'controller._tableColumnsWidth',
    heightBinding: 'controller._tableContentHeight'
  });

}).call(this);
