const start = `
export default props => {
  if (!props.user) return null;
  const { user: { name, gender,  age, skill = '', hobby } } = props;
  const [action, toggleAction] = useState(false);
  const className = action ? 'className1' : 'anotherName';
 return(
    <div className={className}>
        <p>姓名：{name}</p>
        /*等等文字太暗看不到*/ => backgroung:white
        /*再往左边靠*/ => text-align:left
        /*好像有点小拥挤？*/=> padding:10px
        <p>性别：{gender}</p> /*废话*/
        /*文字出现的太普通了，写个动画吧，animation */
        <p>爱好：plmm</P> /*...不对，写错了*
        <p>爱好: {hobby} </p> /*嗯，是的没错*/
        /*再来个旋转试试， transform 3d*/
        <p>年龄：{age}</p>/*真的老了*/
        <p>技能：{skill}</p>
        /*我自己都信了(我怎么不加上吹牛p呢)*/
        /*再来一个交互吧？*/
        <Icon type='redo' onClick={() => toggleAction(!action)}/> 
        /* 好了，试一下点击那个图标能不能toggle这个className*/
    </div>
    )
}`;
export default start;
