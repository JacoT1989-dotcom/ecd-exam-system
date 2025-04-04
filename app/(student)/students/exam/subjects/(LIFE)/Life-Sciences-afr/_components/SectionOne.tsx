import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LewensorientringEksamenVormTipe } from "../types";

interface SectionOneProps {
  form: UseFormReturn<LewensorientringEksamenVormTipe>;
}

// Keep original function name, just update internals
export function SectionOne({ form }: SectionOneProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Afdeling 1: Multikeuse Vrae (1-10)</h2>
      <p className="text-sm text-gray-500 mb-4">
        Kies die korrekte opsie vir elke vraag
      </p>

      {/* Question 1 */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">
          1. Wat is die hoofdoel van die Suid-Afrikaanse Grondwet?
        </h3>
        <FormField
          control={form.control}
          name="vraag1"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value || undefined}
                  className="space-y-2"
                >
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="A" />
                    </FormControl>
                    <FormLabel>
                      A. Om die regte van burgers te beskerm
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="B" />
                    </FormControl>
                    <FormLabel>
                      B. Om riglyne vir ekonomiese groei te verskaf
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="C" />
                    </FormControl>
                    <FormLabel>
                      C. Om die reëls vir internasionale betrekkinge te vestig
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="D" />
                    </FormControl>
                    <FormLabel>D. Om sportgeleenthede te organiseer</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Question 2 */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">
          2. Watter van die volgende is &apos;n mensereg wat in die Handves van
          Regte gewaarborg word?
        </h3>
        <FormField
          control={form.control}
          name="vraag2"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value || undefined}
                  className="space-y-2"
                >
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="A" />
                    </FormControl>
                    <FormLabel>A. Die reg tot gratis behuising</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="B" />
                    </FormControl>
                    <FormLabel>B. Die reg tot menswaardigheid</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="C" />
                    </FormControl>
                    <FormLabel>
                      C. Die reg tot &apos;n hoë-betaalde werk
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="D" />
                    </FormControl>
                    <FormLabel>
                      D. Die reg tot gratis universiteitsonderrig
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Question 3 */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">
          3. Waarna verwys die term &quot;Ubuntu&quot; in die Suid-Afrikaanse
          kultuur?
        </h3>
        <FormField
          control={form.control}
          name="vraag3"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value || undefined}
                  className="space-y-2"
                >
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="A" />
                    </FormControl>
                    <FormLabel>A. &apos;n Tipe tradisionele kos</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="B" />
                    </FormControl>
                    <FormLabel>
                      B. &apos;n Filosofie wat gemeenskap en onderlinge
                      verbintenis beklemtoon
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="C" />
                    </FormControl>
                    <FormLabel>C. &apos;n Tradisionele dans</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="D" />
                    </FormControl>
                    <FormLabel>
                      D. &apos;n Spesifieke taal wat in Suid-Afrika gepraat word
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Question 4 */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">
          4. Watter van die volgende is &apos;n voorbeeld van goeie burgerskap?
        </h3>
        <FormField
          control={form.control}
          name="vraag4"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value || undefined}
                  className="space-y-2"
                >
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="A" />
                    </FormControl>
                    <FormLabel>A. Stem in verkiesings</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="B" />
                    </FormControl>
                    <FormLabel>B. Belastingbetaling vermy</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="C" />
                    </FormControl>
                    <FormLabel>C. Gemeenskapskwessies ignoreer</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="D" />
                    </FormControl>
                    <FormLabel>D. Verkeersreëls oortree</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Question 5 */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">
          5. Wat is &apos;n belangrike kenmerk van &apos;n demokratiese
          samelewing?
        </h3>
        <FormField
          control={form.control}
          name="vraag5"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value || undefined}
                  className="space-y-2"
                >
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="A" />
                    </FormControl>
                    <FormLabel>A. Eenparty-regering</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="B" />
                    </FormControl>
                    <FormLabel>B. Beperkte vryheid van spraak</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="C" />
                    </FormControl>
                    <FormLabel>
                      C. Gereelde vrye en regverdige verkiesings
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="D" />
                    </FormControl>
                    <FormLabel>D. Regeringsbeheer oor die media</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Question 6 */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">
          6. Watter van die volgende is &apos;n gesonde hanteringsmeganisme vir
          stres?
        </h3>
        <FormField
          control={form.control}
          name="vraag6"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value || undefined}
                  className="space-y-2"
                >
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="A" />
                    </FormControl>
                    <FormLabel>A. Gereelde fisiese oefening</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="B" />
                    </FormControl>
                    <FormLabel>B. Dwelmmisbruik</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="C" />
                    </FormControl>
                    <FormLabel>C. Sosiale isolasie</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="D" />
                    </FormControl>
                    <FormLabel>D. Uitstel van take</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Question 7 */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">
          7. Watter van die volgende is &apos;n voordeel van &apos;n
          gebalanseerde dieet?
        </h3>
        <FormField
          control={form.control}
          name="vraag7"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value || undefined}
                  className="space-y-2"
                >
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="A" />
                    </FormControl>
                    <FormLabel>
                      A. Verhoogde risiko van chroniese siektes
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="B" />
                    </FormControl>
                    <FormLabel>
                      B. Verbeterde konsentrasie en energievlakke
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="C" />
                    </FormControl>
                    <FormLabel>C. Verminderde immuunfunksie</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="D" />
                    </FormControl>
                    <FormLabel>D. Stadiger metabolisme</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Question 8 */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">
          8. Wat is &apos;n primêre doel van loopbaanbeplanning?
        </h3>
        <FormField
          control={form.control}
          name="vraag8"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value || undefined}
                  className="space-y-2"
                >
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="A" />
                    </FormControl>
                    <FormLabel>
                      A. Inkomste teen alle koste maksimaliseer
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="B" />
                    </FormControl>
                    <FormLabel>
                      B. Om betekenis en doel in werk te vind
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="C" />
                    </FormControl>
                    <FormLabel>C. Vermy alle uitdagende posisies</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="D" />
                    </FormControl>
                    <FormLabel>D. So min as moontlik werk</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Question 9 */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">9. Wat is portuurdruk?</h3>
        <FormField
          control={form.control}
          name="vraag9"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value || undefined}
                  className="space-y-2"
                >
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="A" />
                    </FormControl>
                    <FormLabel>
                      A. Druk van ouers om akademies te presteer
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="B" />
                    </FormControl>
                    <FormLabel>
                      B. Invloed van vriende om sekere gedrag aan te neem
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="C" />
                    </FormControl>
                    <FormLabel>
                      C. Druk van onderwysers om opdragte te voltooi
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="D" />
                    </FormControl>
                    <FormLabel>
                      D. Druk van werkgewers om oortyd te werk
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Question 10 */}
      <div className="p-4 border rounded-md bg-slate-50">
        <h3 className="text-md font-medium mb-2">
          10. Watter van die volgende is &apos;n kenmerk van &apos;n gesonde
          verhouding?
        </h3>
        <FormField
          control={form.control}
          name="vraag10"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value || undefined}
                  className="space-y-2"
                >
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="A" />
                    </FormControl>
                    <FormLabel>A. Een persoon neem al die besluite</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="B" />
                    </FormControl>
                    <FormLabel>B. Wedersydse respek en vertroue</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="C" />
                    </FormControl>
                    <FormLabel>C. Beperkte kommunikasie</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <RadioGroupItem value="D" />
                    </FormControl>
                    <FormLabel>D. Beherende gedrag</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
