import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./types";
import { CartService } from "../core/cart/services/cartService";
import { ICartService } from "../core/cart/interfaces/cartServiceInterface";
import { RuleService } from "../core/rule/services/RuleService";
import { RuleEngine } from "../core/rule/engine/RuleEngine";
import { IRuleService } from "../core/rule/interfaces/IRuleService";
import { IRuleEngine } from "../core/rule/interfaces/IRuleEngine";
import { RuleRepository } from "../core/rule/repository/ruleRepository";
import { CartRepository } from "../core/cart/repository/cartRepository";
import { CatalogAdapterFactory } from "../modules/product/factories/CatalogAdapterFactory";
import { ICatalogAdapter } from "../modules/product/interfaces/ICatalogAdapter";
import { ShopifyCatalogAdapter } from "../modules/product/adapters/implementations/ShopifyCatalogAdapter";
import { MagentoCatalogAdapter } from "../modules/product/adapters/implementations/MagentoCatalogAdapter";
import { WooCommerceCatalogAdapter } from "../modules/product/adapters/implementations/WooCommerceCatalogAdapter";


// Initialize the Inversify container
const container = new Container();

// Binds the CartService implementation to its interface
container.bind<ICartService>(TYPES.CartService).to(CartService);

// Binds the RuleService implementation to its interface
container.bind<IRuleService>(TYPES.RuleService).to(RuleService);

// Binds the RuleEngine implementation to its interface
container.bind<IRuleEngine>(TYPES.RuleEngine).to(RuleEngine);

// Binds the RuleRepository concrete class
container.bind<RuleRepository>(TYPES.RuleRepository).to(RuleRepository);

// Binds the CartRepository concrete class
container.bind<CartRepository>(TYPES.CartRepository).to(CartRepository);


// Bind all adapter implementations
container.bind<ICatalogAdapter>(TYPES.ShopifyCatalogAdapter).to(ShopifyCatalogAdapter);
container.bind<ICatalogAdapter>(TYPES.MagentoCatalogAdapter).to(MagentoCatalogAdapter);
container.bind<ICatalogAdapter>(TYPES.WooCommerceCatalogAdapter).to(WooCommerceCatalogAdapter);

// Bind the factory
container.bind<CatalogAdapterFactory>(TYPES.CatalogAdapterFactory).to(CatalogAdapterFactory);

export { container };
