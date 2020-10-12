import React, { useState } from 'react';
import { useDidMount } from '@/utils/hooks';

export default function(componentFactory) {
  class AsyncComponent extends React.Component {
    constructor() {
      super();
      this.state = { component: null };
    }
    async componentDidMount() {
      let { default: component } = await componentFactory();
      this.setState({ component });
    }
    render() {
      let Comp = this.state.component;
      return Comp ? <Comp {...this.props} /> : null;
    }
  }
  return AsyncComponent;
}
