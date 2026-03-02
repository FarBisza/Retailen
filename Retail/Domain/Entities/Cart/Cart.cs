namespace Retailen.Domain.Entities.Cart
{
    public class Cart
    {
        public int Id { get; set; }
        public int? CustomerId { get; private set; }      
        public string SessionId { get; private set; }     

        public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;  
        public DateTime? UpdatedAt { get; set; } = DateTime.UtcNow;  
        public bool? Active { get; set; } = true;          

        private readonly List<CartItem> _items = new();    

        public IReadOnlyCollection<CartItem> Items => _items.AsReadOnly(); 

        public Cart() 
        { 
            SessionId = string.Empty; 
        }

        public Cart(int? customerId, string sessionId)
        {
            CustomerId = customerId;
            SessionId = sessionId;
            CreatedAt = DateTime.UtcNow;
            UpdatedAt = DateTime.UtcNow;
            Active = true;
        }

        public void AssignCustomer(int customerId)         
        {
            CustomerId = customerId;
            UpdatedAt = DateTime.UtcNow;
        }

        public void Deactivate()                           
        {
            Active = false;
            UpdatedAt = DateTime.UtcNow;
        }

        public void AddItem(int productId, int quantity)   
        {
            var existing = _items.SingleOrDefault(p => p.ProductId == productId);
            if (existing != null)
            {
                existing.IncreaseQuantity(quantity);
            }
            else
            {
                _items.Add(new CartItem(this.Id, productId, quantity));
            }
            UpdatedAt = DateTime.UtcNow;
        }

        public void RemoveItem(int itemId)                 
        {
            var item = _items.SingleOrDefault(p => p.Id == itemId);
            if (item != null)
            {
                _items.Remove(item);
                UpdatedAt = DateTime.UtcNow;
            }
        }

        public void Clear()                                
        {
            _items.Clear();
            UpdatedAt = DateTime.UtcNow;
        }

        public void UpdateQuantity(int itemId, int newQuantity) 
        {
            var item = _items.SingleOrDefault(p => p.Id == itemId);
            if (item != null)
            {
                item.SetQuantity(newQuantity);
                UpdatedAt = DateTime.UtcNow;
            }
        }
    }
}