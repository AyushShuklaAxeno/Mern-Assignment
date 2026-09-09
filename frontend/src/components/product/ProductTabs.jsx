export const ProductTabs = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: 'details', label: 'Product Details' },
        { id: 'reviews', label: 'Rating & Reviews' },
        { id: 'faqs', label: 'FAQs' },
    ];

    return (
        <div className="tabs">
            <ul className="tabs__list">
                {tabs.map((tab) => (
                    <li
                        key={tab.id}
                        className={`tabs__tab ${activeTab === tab.id ? 'tabs__tab--active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductTabs;
