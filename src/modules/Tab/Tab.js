import _ from 'lodash/fp'
import React, { Children, PropTypes } from 'react'

import {
  AutoControlledComponent as Component,
  customPropTypes,
  getElementType,
  getUnhandledProps,
  META,
} from '../../lib'

import Menu from '../../collections/Menu/Menu'
import TabPane from './TabPane'

/**
 * A Tab is a hidden section of content activated by a Menu.
 * @see Menu
 * @see Segment
 */
class Tab extends Component {
  static _meta = {
    name: 'Tab',
    type: META.TYPES.MODULE,
  }

  static propTypes = {
    /** An element type to render as (string or function). */
    as: customPropTypes.as,

    /** One or more Tab.Pane components. */
    children: PropTypes.node,

    /** The initial activeIndex. */
    defaultActiveIndex: PropTypes.number,

    /** Index of the currently active tab. */
    activeIndex: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    /**
     * Called on tab change.
     *
     * @param {SyntheticEvent} event - React's original SyntheticEvent.
     * @param {object} data - The proposed new Tab.Pane.
     * @param {object} data.activeIndex - The new proposed activeIndex.
     * @param {object} data.panes - Props of the new proposed active pane.
     */
    onChange: PropTypes.func,

    /** Shorthand props for the Menu. */
    menu: customPropTypes.contentShorthand,

    /**
     * TODO use a top level renderPane instead or also?
     * @param {number} activeIndex - The currently active index.
     * @param {object} props - The currently active index.
     * @returns {*} - Any React renderable.
     */
    renderPane: PropTypes.func,

    /** Shorthand props for the Menu. */
    panes: PropTypes.arrayOf(PropTypes.shape({
      menuItem: PropTypes.string.isRequired,
      render: PropTypes.func.isRequired,
    })),
  }

  static autoControlledProps = [
    'activeIndex',
  ]

  static Pane = TabPane

  state = {
    activeIndex: 0,
  }

  handleItemClick = (e, { index }) => {
    this.trySetState({ activeIndex: index })
    _.invoke('onChange', this.props, [e, { activeIndex: index, panes: this.panes[index] }])
  }

  overrideMenuProps = (props) => ({
    items: _.map('menuItem', this.props.panes),
    onItemClick: this.handleItemClick,
    activeIndex: this.state.activeIndex,
  })

  renderMenu() {
    const { menu } = this.props

    return Menu.create(
      { ...menu, ...this.overrideMenuProps(menu) }, // TODO this needs override props for factories instead
      { attached: true, tabular: true }
      /* { overrideProps: this.overrideMenuProps } */)
  }

  render() {
    const { menu = {}, panes } = this.props
    const { activeIndex } = this.state

    const rest = getUnhandledProps(Tab, this.props)
    const ElementType = getElementType(Tab, this.props)

    return (
      <ElementType {...rest}>
        {menu.attached !== 'bottom' && this.renderMenu()}
        {panes[activeIndex].render(this.props)}
        {menu.attached === 'bottom' && this.renderMenu()}
      </ElementType>
    )
  }
}

export default Tab
