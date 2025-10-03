import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ALLOWED_LANGUAGES = ["python", "java", "cpp", "c", "c++", "html", "css", "javascript"];
const MAX_CODE_LENGTH = 10000; // 10KB limit

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // Verify user is authenticated
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { code, language } = await req.json();

    // Input validation
    if (!code || typeof code !== 'string') {
      throw new Error('Invalid code input');
    }

    if (code.length > MAX_CODE_LENGTH) {
      throw new Error(`Code exceeds maximum length of ${MAX_CODE_LENGTH} characters`);
    }

    if (!language || !ALLOWED_LANGUAGES.includes(language.toLowerCase())) {
      throw new Error(`Unsupported language. Allowed: ${ALLOWED_LANGUAGES.join(', ')}`);
    }

    // Map language names to Piston API language identifiers
    const languageMap: Record<string, string> = {
      python: "python",
      java: "java",
      cpp: "cpp",
      c: "cpp",
      "c++": "cpp",
      html: "html",
      css: "css",
      javascript: "javascript",
    };

    const pistonLanguage = languageMap[language.toLowerCase()] || language;

    // Use Piston API for code execution
    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: pistonLanguage,
        version: "*",
        files: [
          {
            content: code,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Piston API error: ${response.status}`);
    }

    const result = await response.json();

    // Log execution for monitoring (without exposing code)
    console.log(`Code execution by user ${user.id}: ${language}, length: ${code.length}`);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    // Log error securely
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Code execution error:", errorMessage);
    
    // Return sanitized error to user
    const userMessage = errorMessage.includes("Unauthorized") || errorMessage.includes("authorization")
      ? "Authentication required"
      : errorMessage.includes("Invalid") || errorMessage.includes("Unsupported")
      ? errorMessage
      : "Code execution failed. Please try again.";

    return new Response(
      JSON.stringify({ error: userMessage }),
      {
        status: errorMessage.includes("Unauthorized") ? 401 : 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
