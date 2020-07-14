import ReactDOM from 'react-dom';

export const mountComponent = (component, appendId = '__wrapComponent__') => {
  const parent = document.getElementById(appendId);
  if (!parent) {
    const __wrapComponent__ = document.createElement('div');
    __wrapComponent__.id = appendId;
    document.body.appendChild(__wrapComponent__);
  }
  ReactDOM.render(component(), document.getElementById(appendId));
};
