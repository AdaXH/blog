import * as React from 'react';
import { connect } from 'dva';
import { withRouter } from 'react-router';
import s from './pagination.less';

@connect(({ pagenation }) => ({ pagenation }))
class _Pagination extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paginationProps: {
        current: 1,
        total: 5,
        pageSize: 5,
        onChange: current => console.log(current),
        ...props,
        list: [],
        defaultPage: 0,
      },
    };
  }

  reducerPagesize(current) {
    const { dispatch } = this.props;
    const key = this.props.location.pathname.replace(/\//, '');
    dispatch({
      type: 'pagenation/setPagesize',
      payload: { [key]: current },
    });
  }

  componentDidMount() {
    //初始化list
    // const { pagenation } = this.props;
    // const key = this.props.location.pathname.replace(/\//, '');
    const defaultPage = 1;
    const { pageSize, total } = this.state.paginationProps;
    const _total = total / pageSize;
    const end = _total <= pageSize ? _total : pageSize;
    const lists = [];
    for (let i = 0; i < end; i++)
      lists.push({
        isCurrent: defaultPage === i + 1,
        pagi: i + 1,
      });
    this.setState(state => ({
      paginationProps: {
        ...state.paginationProps,
        list: lists,
        // defaultPage,
      },
    }));
  }

  handleDirection(type, isCurrent, e) {
    //处理翻页
    e.stopPropagation();
    e.preventDefault();
    if (isCurrent) return;
    const { list, pageSize, total, onChange } = this.state.paginationProps;
    const newList = [];
    const _total = Math.ceil(total / pageSize);
    if (type === 'next') {
      const lastPagi = list[list.length - 1].pagi;
      if (lastPagi < _total)
        for (let i = 0; i < pageSize; i++) {
          lastPagi + i + 1 <= _total &&
            newList.push({ isCurrent: i === 0, pagi: lastPagi + i + 1 });
          if (i === 0) {
            onChange(lastPagi + i + 1);
            this.reducerPagesize(lastPagi + i + 1);
          }
        }
    } else {
      const firstPagi = list[0].pagi;
      if (firstPagi !== 1)
        for (let i = firstPagi - pageSize; i <= firstPagi - 1; i++) {
          newList.push({ isCurrent: i === firstPagi - 1, pagi: i });
          if (i === firstPagi - 1) {
            onChange(i);
            this.reducerPagesize(i);
          }
        }
    }
    this.setState(({ paginationProps }) => ({
      paginationProps: {
        ...paginationProps,
        list: newList,
      },
    }));
  }
  handleChange(item) {
    //处理点击
    const { paginationProps } = this.state;
    if (item.isCurrent) return;
    for (let pagi of paginationProps.list) {
      pagi.isCurrent = false;
      pagi.pagi === item.pagi && (pagi.isCurrent = true);
    }
    this.setState(
      ({ paginationProps }) => ({
        paginationProps: {
          ...paginationProps,
        },
      }),
      () => {
        this.reducerPagesize(item.pagi);
        this.state.paginationProps.onChange(item.pagi);
      }
    );
  }
  render() {
    const { list, total, pageSize } = this.state.paginationProps;
    const isOneTargrt = list[0] && list[0].pagi === 1;
    const isLastTargrt =
      list[list.length - 1] &&
      list[list.length - 1].pagi >= Math.floor(total / pageSize);
    return (
      <div className={s.paginationContainer}>
        <div className={s.paginationCOntent}>
          <div className={s.paginationList}>
            <div
              onClick={e => this.handleDirection('prev', isOneTargrt, e)}
              className={`${s.left} ${isOneTargrt && s.current}`}
            >
              <i className="iconfont icon-fanhui" />
            </div>
            {list &&
              list.length !== 0 &&
              list.map((item, i) => {
                const { isCurrent } = item;
                return (
                  <div
                    key={i}
                    style={{}}
                    className={`${s.paginationItem} ${isCurrent &&
                      s.isCurrent}`}
                    onClick={() => this.handleChange(item)}
                  >
                    {item.pagi}
                  </div>
                );
              })}
            <div
              onClick={e => this.handleDirection('next', isLastTargrt, e)}
              className={`${s.right} ${isLastTargrt && s.current}`}
            >
              <i className="iconfont icon-fanhui" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(_Pagination);
