import MemberService from "./Member.service";
import ProductService from "./Product.service";
import OrderService from "./Order.service";
import { MemberStatus } from "../libs/enums/member.enum";
import { ProductStatus } from "../libs/enums/product.enum";
import { Member } from "../libs/types/member";
import { Product } from "../libs/types/product";
import { Order } from "../libs/types/order";

class StatisticsService {
  private memberService: MemberService;
  private productService: ProductService;
  private orderService: OrderService;

  constructor() {
    this.memberService = new MemberService();
    this.productService = new ProductService();
    this.orderService = new OrderService();
  }

  async getDashboardStats() {
    try {
      // Get all statistics in parallel for better performance
      const [
        totalUsers,
        activeUsers,
        blockedUsers,
        totalProducts,
        activeProducts,
        totalOrders,
        todayOrders,
        totalRevenue,
        inventoryRetailValue
      ] = await Promise.all([
        this.getTotalUsers(),
        this.getActiveUsers(),
        this.getBlockedUsers(),
        this.getTotalProducts(),
        this.getActiveProducts(),
        this.getTotalOrders(),
        this.getTodayOrders(),
        this.getTotalRevenue(),
        this.getInventoryRetailValue()
      ]);

      return {
        users: {
          total: totalUsers,
          active: activeUsers,
          blocked: blockedUsers
        },
        products: {
          total: totalProducts,
          active: activeProducts
        },
        orders: {
          total: totalOrders,
          today: todayOrders
        },
        revenue: {
          total: totalRevenue
        },
        inventory: {
          retailValue: inventoryRetailValue
        },
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  private async getTotalUsers(): Promise<number> {
    try {
      const users = await this.memberService.getUsers();
      return users.length;
    } catch (error) {
      console.error('Error getting total users:', error);
      return 0;
    }
  }

  private async getActiveUsers(): Promise<number> {
    try {
      const users = await this.memberService.getUsers();
      return users.filter(user => user.memberStatus === MemberStatus.ACTIVE).length;
    } catch (error) {
      console.error('Error getting active users:', error);
      return 0;
    }
  }

  private async getBlockedUsers(): Promise<number> {
    try {
      const users = await this.memberService.getUsers();
      return users.filter(user => user.memberStatus === MemberStatus.BLOCK).length;
    } catch (error) {
      console.error('Error getting blocked users:', error);
      return 0;
    }
  }

  private async getTotalProducts(): Promise<number> {
    try {
      const products = await this.productService.getAllProducts();
      return products.length;
    } catch (error) {
      console.error('Error getting total products:', error);
      return 0;
    }
  }

  private async getActiveProducts(): Promise<number> {
    try {
      const products = await this.productService.getAllProducts();
      return products.filter(product => product.productStatus === ProductStatus.PROCESS).length;
    } catch (error) {
      console.error('Error getting active products:', error);
      return 0;
    }
  }

  private async getTotalOrders(): Promise<number> {
    try {
      const orders = await this.orderService.getAllOrders();
      return orders.length;
    } catch (error) {
      console.error('Error getting total orders:', error);
      return 0;
    }
  }

  private async getTodayOrders(): Promise<number> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const orders = await this.orderService.getAllOrders();
      return orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate.getTime() === today.getTime();
      }).length;
    } catch (error) {
      console.error('Error getting today orders:', error);
      return 0;
    }
  }

  private async getTotalRevenue(): Promise<number> {
    try {
      const orders = await this.orderService.getAllOrders();
      return orders.reduce((total: number, order: Order) => {
        return total + (order.orderTotal || 0);
      }, 0);
    } catch (error) {
      console.error('Error getting total revenue:', error);
      return 0;
    }
  }

  /** Sum of productPrice × productLeftCount across all jerseys (inventory at retail). */
  private async getInventoryRetailValue(): Promise<number> {
    try {
      const products = await this.productService.getAllProducts();
      return products.reduce((sum, p) => {
        const price = Number(p.productPrice) || 0;
        const qty = Number(p.productLeftCount) || 0;
        return sum + price * qty;
      }, 0);
    } catch (error) {
      console.error('Error getting inventory retail value:', error);
      return 0;
    }
  }

  async getRecentActivity() {
    try {
      const [recentUsers, recentProducts, recentOrders] = await Promise.all([
        this.getRecentUsers(),
        this.getRecentProducts(),
        this.getRecentOrders()
      ]);

      // Combine and sort by date
      const activities = [
        ...recentUsers.map((user: Member) => ({
          type: 'user_registration',
          title: 'New user registered',
          description: `${user.memberNick} joined the platform`,
          timestamp: user.createdAt,
          icon: 'fas fa-user-plus'
        })),
        ...recentProducts.map((product: Product) => ({
          type: 'product_update',
          title: 'Product updated',
          description: `${product.productName} - ${product.productCollection}`,
          timestamp: product.updatedAt,
          icon: 'fas fa-tshirt'
        })),
        ...recentOrders.map((order: Order) => ({
          type: 'new_order',
          title: 'New order received',
          description: `Order #${order._id} - $${order.orderTotal}`,
          timestamp: order.createdAt,
          icon: 'fas fa-shopping-cart'
        }))
      ];

      // Sort by timestamp (most recent first) and return last 10
      return activities
        .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return [];
    }
  }

  private async getRecentUsers(): Promise<Member[]> {
    try {
      const users = await this.memberService.getUsers();
      return users
        .sort((a: Member, b: Member) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
    } catch (error) {
      console.error('Error getting recent users:', error);
      return [];
    }
  }

  private async getRecentProducts(): Promise<Product[]> {
    try {
      const products = await this.productService.getAllProducts();
      return products
        .sort((a: Product, b: Product) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5);
    } catch (error) {
      console.error('Error getting recent products:', error);
      return [];
    }
  }

  private async getRecentOrders(): Promise<Order[]> {
    try {
      const orders = await this.orderService.getAllOrders();
      return orders
        .sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
    } catch (error) {
      console.error('Error getting recent orders:', error);
      return [];
    }
  }
}

export default StatisticsService;
