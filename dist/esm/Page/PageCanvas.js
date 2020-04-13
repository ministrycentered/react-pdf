import _extends from "@babel/runtime/helpers/esm/extends";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import PageContext from '../PageContext';
import { callIfDefined, errorOnDev, getPixelRatio, isCancelException, makePageCallback } from '../shared/utils';
import { isPage, isRotate } from '../shared/propTypes';
export var PageCanvasInternal = /*#__PURE__*/function (_PureComponent) {
  _inherits(PageCanvasInternal, _PureComponent);

  function PageCanvasInternal() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, PageCanvasInternal);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(PageCanvasInternal)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "onRenderSuccess", function () {
      _this.renderer = null;
      var _this$props = _this.props,
          onRenderSuccess = _this$props.onRenderSuccess,
          page = _this$props.page,
          scale = _this$props.scale;
      callIfDefined(onRenderSuccess, makePageCallback(page, scale));
    });

    _defineProperty(_assertThisInitialized(_this), "onRenderError", function (error) {
      if (isCancelException(error)) {
        return;
      }

      errorOnDev(error);
      var onRenderError = _this.props.onRenderError;
      callIfDefined(onRenderError, error);
    });

    _defineProperty(_assertThisInitialized(_this), "drawPageOnCanvas", function () {
      var _assertThisInitialize = _assertThisInitialized(_this),
          canvas = _assertThisInitialize.canvasLayer;

      if (!canvas) {
        return null;
      }

      var _assertThisInitialize2 = _assertThisInitialized(_this),
          renderViewport = _assertThisInitialize2.renderViewport,
          viewport = _assertThisInitialize2.viewport;

      var _this$props2 = _this.props,
          page = _this$props2.page,
          renderInteractiveForms = _this$props2.renderInteractiveForms;
      canvas.width = renderViewport.width;
      canvas.height = renderViewport.height;
      canvas.style.width = "".concat(Math.floor(viewport.width), "px");
      canvas.style.height = "".concat(Math.floor(viewport.height), "px");
      var renderContext = {
        get canvasContext() {
          return canvas.getContext('2d');
        },

        viewport: renderViewport,
        renderInteractiveForms: renderInteractiveForms
      }; // If another render is in progress, let's cancel it

      _this.cancelRenderingTask();

      _this.renderer = page.render(renderContext);
      return _this.renderer.promise.then(_this.onRenderSuccess)["catch"](_this.onRenderError);
    });

    return _this;
  }

  _createClass(PageCanvasInternal, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.drawPageOnCanvas();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this$props3 = this.props,
          page = _this$props3.page,
          renderInteractiveForms = _this$props3.renderInteractiveForms;

      if (renderInteractiveForms !== prevProps.renderInteractiveForms) {
        // Ensures the canvas will be re-rendered from scratch. Otherwise all form data will stay.
        page.cleanup();
        this.drawPageOnCanvas();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.cancelRenderingTask();
      /**
       * Zeroing the width and height cause most browsers to release graphics
       * resources immediately, which can greatly reduce memory consumption.
       */

      if (this.canvasLayer) {
        this.canvasLayer.width = 0;
        this.canvasLayer.height = 0;
        this.canvasLayer = null;
      }
    }
  }, {
    key: "cancelRenderingTask",
    value: function cancelRenderingTask() {
      /* eslint-disable no-underscore-dangle */
      if (this.renderer && this.renderer._internalRenderTask.running) {
        this.renderer._internalRenderTask.cancel();
      }
      /* eslint-enable no-underscore-dangle */

    }
    /**
     * Called when a page is rendered successfully.
     */

  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return React.createElement("canvas", {
        className: "react-pdf__Page__canvas",
        ref: function ref(_ref) {
          _this2.canvasLayer = _ref;
        },
        style: {
          display: 'block',
          userSelect: 'none'
        }
      });
    }
  }, {
    key: "renderViewport",
    get: function get() {
      var _this$props4 = this.props,
          page = _this$props4.page,
          rotate = _this$props4.rotate,
          scale = _this$props4.scale;
      var pixelRatio = getPixelRatio();
      return page.getViewport({
        scale: scale * pixelRatio,
        rotation: rotate
      });
    }
  }, {
    key: "viewport",
    get: function get() {
      var _this$props5 = this.props,
          page = _this$props5.page,
          rotate = _this$props5.rotate,
          scale = _this$props5.scale;
      return page.getViewport({
        scale: scale,
        rotation: rotate
      });
    }
  }]);

  return PageCanvasInternal;
}(PureComponent);
PageCanvasInternal.propTypes = {
  onRenderError: PropTypes.func,
  onRenderSuccess: PropTypes.func,
  page: isPage.isRequired,
  renderInteractiveForms: PropTypes.bool,
  rotate: isRotate,
  scale: PropTypes.number
};
export default function PageCanvas(props) {
  return React.createElement(PageContext.Consumer, null, function (context) {
    return React.createElement(PageCanvasInternal, _extends({}, context, props));
  });
}