namespace ServerApp.Models
{
    public class Product
    {
        public int ProductId { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public bool IsActive { get; set; }
        public string Secret { get; set; } 
        public int MyProperty { get; set; }
    }
}