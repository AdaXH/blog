// import * as React from 'react';
// import RcPagination from 'rc-pagination';
// import enUS from 'rc-pagination/lib/locale/en_US';
// import classNames from 'classnames';
// import MiniSelect from './MiniSelect';
// import Icon from '../icon';
// import Select from '../select';
// import LocaleReceiver from '../locale-provider/LocaleReceiver';
// import { ConfigConsumer, ConfigConsumerProps } from '../config-provider';

// export interface PaginationProps {
//     total?: number;
//     defaultCurrent?: number;
//     current?: number;
//     defaultPageSize?: number;
//     pageSize?: number;
//     onChange?: (page: number, pageSize?: number) => void
// }

// export type PaginationLocale = any;

// export default class Pagination extends React.Component<PaginationProps, {}> {
//     getIconsProps = (prefixCls: string) => {
//         const prevIcon = (
//             <a className={`${prefixCls}-item-link`}>
//                 <Icon type="left" />
//             </a>
//         );
//         const nextIcon = (
//             <a className={`${prefixCls}-item-link`}>
//                 <Icon type="right" />
//             </a>
//         );
//         const jumpPrevIcon = (
//             <a className={`${prefixCls}-item-link`}>
//                 {/* You can use transition effects in the container :) */}
//                 <div className={`${prefixCls}-item-container`}>
//                     <Icon className={`${prefixCls}-item-link-icon`} type="double-left" />
//                     <span className={`${prefixCls}-item-ellipsis`}>•••</span>
//                 </div>
//             </a>
//         );
//         const jumpNextIcon = (
//             <a className={`${prefixCls}-item-link`}>
//                 {/* You can use transition effects in the container :) */}
//                 <div className={`${prefixCls}-item-container`}>
//                     <Icon className={`${prefixCls}-item-link-icon`} type="double-right" />
//                     <span className={`${prefixCls}-item-ellipsis`}>•••</span>
//                 </div>
//             </a>
//         );
//         return {
//             prevIcon,
//             nextIcon,
//             jumpPrevIcon,
//             jumpNextIcon,
//         };
//     };
//     renderPagination = (contextLocale: PaginationLocale) => {
//         const {
//             prefixCls: customizePrefixCls,
//             selectPrefixCls: customizeSelectPrefixCls,
//             className,
//             size,
//             locale: customLocale,
//             ...restProps
//         } = this.props;
//         const locale = { ...contextLocale, ...customLocale };
//         const isSmall = size === 'small';
//         return (
//             <ConfigConsumer>
//                 {({ getPrefixCls }: ConfigConsumerProps) => {
//                     const prefixCls = getPrefixCls('pagination', customizePrefixCls);
//                     const selectPrefixCls = getPrefixCls('select', customizeSelectPrefixCls);
//                     return (
//                         <RcPagination
//                             {...restProps}
//                             prefixCls={prefixCls}
//                             selectPrefixCls={selectPrefixCls}
//                             {...this.getIconsProps(prefixCls)}
//                             className={classNames(className, { mini: isSmall })}
//                             selectComponentClass={isSmall ? MiniSelect : Select}
//                             locale={locale}
//                         />
//                     );
//                 }}
//             </ConfigConsumer>
//         );
//     };
//     render() {
//         return (
//             <LocaleReceiver componentName="Pagination" defaultLocale={enUS}>
//                 {this.renderPagination}
//             </LocaleReceiver>
//         );
//     }
// }
