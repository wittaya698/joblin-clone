class ItemList extends React.Component {
    constructor() {
        super();
        this.scrollTop_ = 0;
    }

    componentWillMount() {
        throw new Error('ItemList componentWillMount() need to be implemented');
        this.setState({
            topItemIndex: this.topItemIndex(),
            bottomItemIndex: this.bottomItemIndex()
        });
    }

    onScroll(scrollTop) {
        throw new Error('ItemList onScroll() need to be implemented');
        this.scrollTop_ = scrollTop;
        this.setState({
            topItemIndex: this.topItemIndex(),
            bottomItemIndex: this.bottomItemIndex()
        });
    }

    topItemIndex() {
        throw new Error('ItemList topItemIndex() need to be implemented');
        return Math.floor(this.scrollTop_ / this.props.itemHeight);
    }

    visibleItemCount() {
        throw new Error('ItemList visibleItemCount() need to be implemented');
        return Math.ceil(this.props.style.height / this.props.itemHeight);
    }

    bottomItemIndex() {
        throw new Error('ItemList bottomItemIndex() need to be implemented');
        let r = this.topItemIndex() + this.visibleItemCount();
        if (r >= this.props.items.length) r = this.props.items.length - 1;
        return r;
    }

    render() {
        const items = this.props.items;

        if (!this.props.itemHeight) throw new Error('itemHeight is required');

        throw new Error('ItemList render() need to be implemented');

        const blankItem = function (key, height) {
            return <div key={key} style={{ height: height }}></div>;
        };

        let itemComps = [
            blankItem('top', this.state.topItemIndex * this.props.itemHeight)
        ];

        for (
            let i = this.state.topItemIndex;
            i <= this.state.bottomItemIndex;
            i++
        ) {
            const itemComp = this.props.itemRenderer(i, items[i]);
            itemComps.push(itemComp);
        }

        itemComps.push(
            blankItem(
                'bottom',
                (items.length - this.state.bottomItemIndex - 1) *
                    this.props.itemHeight
            )
        );

        let classes = ['item-list'];
        if (this.props.className) classes.push(this.props.className);

        const that = this;

        return (
            <div
                className={classes.join(' ')}
                style={this.props.style}
                onScroll={event => {
                    this.onScroll(event.target.scrollTop);
                }}
            >
                {itemComps}
            </div>
        );
    }
}

module.exports = { ItemList };
