import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './SlideOut.css';

export default class Slider extends Component {
    static propTypes = {
        isOpen: PropTypes.bool,
        onOutsideClick: PropTypes.func,
        title: PropTypes.string,
        footer: PropTypes.node,
        header: PropTypes.node,
        children: PropTypes.node,
        verticalOffset: PropTypes.shape({
            top: PropTypes.number,
            bottom: PropTypes.number,
        }),
        foldWidth: PropTypes.string,
        foldMode: PropTypes.bool,
        leftToRight: PropTypes.bool,
        headerHeight: PropTypes.number,
        footerHeight: PropTypes.number,
    };

    static defaultProps = {
        foldWidth: '140px',
        headerHeight: 65,
        footerHeight: 65,
    };

    constructor(props) {
        super(props);
        let contentStyle;
        const offset = props.verticalOffset;
        const verticalOffset = offset
            ? (offset.top ? offset.top : 0) + (offset.bottom ? offset.bottom : 0)
            : 0;

        let headerFooterHeight;

        if (!this.props.footer && !this.props.title && !this.props.header) {
            headerFooterHeight = 0;
        } else if (this.props.footer) {
            headerFooterHeight = this.props.footerHeight;
        } else if (this.props.header || this.props.title) {
            headerFooterHeight = this.props.headerHeight;
        } else {
            headerFooterHeight = this.props.footerHeight + this.props.headerHeight;
        }

        contentStyle = { height: `calc(100vh - ${headerFooterHeight + verticalOffset}%)` };

        this.state = {
            isOpen: this.props.foldMode ? true : !!props.isOpen,
            wrapperClass: 'SlideWrapper--open',
            sliderClass: 'SlideModal--open',
            contentStyle,
        };
        this.bodyElement = document.getElementsByTagName('body')[0];
    }

    componentDidUpdate(prevProps, prevState) {
        if (!prevState.isOpen && this.state.isOpen) {
            this.bodyElement.classList.add('h-overflowHidden');
        } else if (prevState.isOpen && !this.state.isOpen) {
            this.bodyElement.classList.remove('h-overflowHidden');
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.isOpen && !nextProps.isOpen) {
            return {
                sliderClass: 'SlideModal--close',
                wrapperClass: 'SlideWrapper--close',
            };
        } else if (!prevState.isOpen && nextProps.isOpen) {
            return {
                isOpen: true,
                wrapperClass: 'SlideWrapper--open',
                sliderClass: 'SlideModal--open',
            };
        } else {
            return null;
        }
    }

    componentWillUnmount() {
        this.bodyElement.classList.remove('h-overflowHidden');
    }

    onAnimationEnd = (e) => {
        if (e.animationName === 'slideOut--right' || e.animationName === 'slideOut--left') {
            this.setState({ isOpen: false });
        }
    };

    onWrapperClick = (e) => {
        const className = e.target.getAttribute('class') || '';
        if (
            className.includes('js-slideWrapper') &&
            this.props.onOutsideClick &&
            !this.props.foldMode
        ) {
            this.props.onOutsideClick();
        }
    };

    render() {
        const offsetStyle = this.props.verticalOffset
            ? {
                  top: this.props.verticalOffset.top,
                  bottom: this.props.verticalOffset.bottom,
              }
            : {};

        const foldStyle =
            this.props.foldMode && this.props.isFolded
                ? {
                      width: this.props.foldWidth,
                      minWidth: 'auto',
                  }
                : {};
        const foldOverlayStyles = this.props.foldMode
            ? {
                  zIndex: '0',
                  position: 'static',
              }
            : {};

        const sliderDirectionClassName = this.props.leftToRight
            ? 'SlideModal SlideModal--left '
            : 'SlideModal SlideModal--right ';

        return this.state.isOpen || this.props.foldMode ? (
            <div
                onAnimationEnd={this.onAnimationEnd}
                className={'SlideWrapper js-slideWrapper' + ' ' + this.state.wrapperClass}
                onClick={this.onWrapperClick}
                style={{ ...offsetStyle, ...foldOverlayStyles }}
            >
                <div
                    className={sliderDirectionClassName + this.state.sliderClass}
                    style={{ ...offsetStyle, ...foldStyle }}
                >
                    <div
                        className="h-displayFlex h-flexCol h-flexSpaceBetween"
                        style={{ height: '100%' }}
                    >
                        {this.props.title || this.props.header ? (
                            <div
                                className="SlideModal__header js-slideModalHeader"
                                style={{ height: `${this.props.headerHeight}%` }}
                            >
                                {this.props.title && (
                                    <h4 className="SlideModal__title">{this.props.title}</h4>
                                )}
                                {this.props.header}
                            </div>
                        ) : null}
                        <div
                            className={'h-overflowAuto ' + this.state.contentClass}
                            style={this.state.contentStyle}
                        >
                            {this.props.children}
                        </div>
                        {this.props.footer && (
                            <div
                                className="SlideModal__header SlideModal__footer"
                                style={{ height: `${this.props.footerHeight}%` }}
                            >
                                {this.props.footer}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        ) : null;
    }
}
