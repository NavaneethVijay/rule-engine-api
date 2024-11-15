import { controller, httpGet } from "inversify-express-utils";
import { inject } from "inversify";
import { supabase } from "../../../infrastructure/database/supabaseClient";

@controller("/config")
export class ConfigController {
    @httpGet("/")
    async getConfigurations() {
        try {
            // Fetch websites and customer groups in parallel
            const [{ data: websites, error: websiteError }, { data: customerGroups, error: customerGroupError }] =
                await Promise.all([
                    supabase.from('website').select('*'),
                    supabase.from('customer_group').select('*')
                ]);

            if (websiteError) throw new Error(`Failed to fetch websites: ${websiteError.message}`);
            if (customerGroupError) throw new Error(`Failed to fetch customer groups: ${customerGroupError.message}`);

            return {
                success: true,
                data: {
                    websites,
                    customerGroups
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}