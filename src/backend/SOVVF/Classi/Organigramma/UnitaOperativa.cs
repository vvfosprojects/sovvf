//-----------------------------------------------------------------------
// <copyright file="UnitaOperativa.cs" company="CNVVF">
// Copyright (C) 2017 - CNVVF
//
// This file is part of SOVVF.
// SOVVF is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// SOVVF is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see http://www.gnu.org/licenses/.
// </copyright>
//-----------------------------------------------------------------------
using System.Collections.Generic;
using System.Linq;

namespace Modello.Classi.Organigramma
{
    /// <summary>
    ///   E' la generica unità operativa all'interno dell'organigramma operativo del Corpo Nazionale.
    /// </summary>
    public class UnitaOperativa
    {
        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        public UnitaOperativa()
        {
            this.Figli = new HashSet<UnitaOperativa>();
        }

        /// <summary>
        ///   Codice dell'unità operativa
        /// </summary>
        public string Codice { get; set; }

        /// <summary>
        ///   Il nome dell'inità operativa
        /// </summary>
        public string Nome { get; set; }

        /// <summary>
        ///   Le unità operative figlie nell'organigramma
        /// </summary>
        public ISet<UnitaOperativa> Figli { get; set; }

        /// <summary>
        ///   L'unità operativa padre
        /// </summary>
        /// <remarks>Il valore è null per le unità operative radice</remarks>
        public UnitaOperativa Padre { get; set; }

        /// <summary>
        ///   Restituisce tutte le unità operative presenti nel sottoalbero, radice compresa
        /// </summary>
        /// <returns>Le unità operative</returns>
        public virtual IEnumerable<UnitaOperativa> GetSottoAlbero()
        {
            yield return this;

            foreach (var figlio in this.Figli)
            {
                foreach (var uo in figlio.GetSottoAlbero())
                {
                    yield return uo;
                }
            }

            yield break;
        }

        /// <summary>
        ///   Restituisce tutte le unità operative presenti nel sottoalbero che corrispondono
        ///   all'insieme dei tags
        /// </summary>
        /// <param name="tags">I tags da espandere</param>
        /// <returns>
        ///   I tags che individuano le unità operative da restituire, ciascuno indicante l'eventuale ricorsività
        /// </returns>
        public virtual IEnumerable<UnitaOperativa> GetSottoAlbero(IEnumerable<TagNodo> tags)
        {
            var tag = tags.SingleOrDefault(t => t.Codice == this.Codice);
            if (tag != null)
            {
                if (tag.Ricorsivo)
                {
                    foreach (var n in this.GetSottoAlbero())
                    {
                        yield return n;
                    }
                }
                else
                {
                    yield return this;

                    foreach (var f in this.Figli)
                    {
                        foreach (var n in f.GetSottoAlbero(tags))
                        {
                            yield return n;
                        }
                    }
                }
            }
            else
            {
                foreach (var f in this.Figli)
                {
                    foreach (var n in f.GetSottoAlbero(tags))
                    {
                        yield return n;
                    }
                }
            }
        }

        /// <summary>
        ///   Aggiunge un'unità operativa figlia preservando l'invariante sul legame padre-figlio
        /// </summary>
        /// <param name="unitaOperativa">L'unità operativa da aggiungere ai figli</param>
        public void AddFiglio(UnitaOperativa unitaOperativa)
        {
            this.Figli.Add(unitaOperativa);
            unitaOperativa.Padre = this;
        }

        /// <summary>
        ///   Per la classe, un'UnitaOperativa è uguale ad un'altra UnitaOperativa se hanno lo stesso codice
        /// </summary>
        /// <param name="obj">Oggetto da confrontare</param>
        /// <returns>true se l'UnitaOpertaiva passata è uguale</returns>
        public override bool Equals(object obj)
        {
            if (!(obj is UnitaOperativa))
            {
                return false;
            }

            var uo = (UnitaOperativa)obj;

            return uo.Codice.Equals(this.Codice);
        }

        /// <summary>
        ///   Restituisce l'hascode del codice
        /// </summary>
        /// <returns>Hashcode dell'istanza</returns>
        public override int GetHashCode()
        {
            return this.Codice.GetHashCode();
        }

        /// <summary>
        ///   Fornisce una rappresentazione di comodo dell'unità operativa.
        /// </summary>
        /// <returns>La stringa descrittiva dell'unità operativa.</returns>
        public override string ToString()
        {
            return string.Format("{0} - {1} (Figli: {2})", this.Codice, this.Nome, this.Figli.Count);
        }
    }
}
