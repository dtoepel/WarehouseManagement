type HeaderControlProps = {
    onAddProductClick: () => void;
    query: string;
    onQueryChange: (v: string) => void;
};

export default function HeaderControl({onAddProductClick, query, onQueryChange}: HeaderControlProps) {
    return (
        <div className='header-container'>
            <div className='app-title'>
                <h1>Warehouse Management</h1>
            </div>
            <div className='header-controls'>
                {/*Header area*/}
                <div className="search-box">
                    <input
                        type='text'
                        placeholder='Search name or SKU…'
                        aria-label='Search products'
                        value={query}
                        onChange={(e) => onQueryChange(e.target.value)}
                    />
                </div>
                <div className="table-toolbar">
                    <button className="productButton" onClick={onAddProductClick}>
                        Add Product
                    </button>
                </div>
            </div>
        </div>
    );
};
